import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { Ocena } from "../uporabnik/models/ocena";
import { Polnilnica } from "../uporabnik/models/polnilnica";
import { Racun } from "../uporabnik/models/racun";
import { Report } from "../uporabnik/models/report";
import { Uporabnik } from "../uporabnik/models/uporabnik";
import { MagicService } from "../uporabnik/services/uporabnik.service";

declare var $: any;

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
    constructor(private magicService: MagicService, private router: Router, private homeComponent: HomeComponent) {}

    public user: Uporabnik = null;
    public retypePassword: String = "";
    public newPassword = "";
    public passwordStage: Number = 1;

    public user_charging: Boolean = false;

    public showUserModal: Boolean = false;
    public showPasswordChangeModal: Boolean = false;

    public showAddFundsModal: Boolean = false;

    public cardCVV: string = "702";
    public cardAmount: number = 10;
    public cardNumber: string = "4987 08XX XXXX XXXX";

    public toastMessage: String = "";

    public showAdminPanel: boolean = false;
    public newPolnilnica: Polnilnica = new Polnilnica();
    public reportList: Report[] = null;
    public days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    public months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    public showTransactionsModal = false;
    public transactions: Racun[] = null;

    prettyJson(json: any) {
        return JSON.stringify(json, null, 2);
    }

    toggleModalTransactions() {
        this.showTransactionsModal = !this.showTransactionsModal;
        if (this.showTransactionsModal) {
            this.magicService.getUserTransactions(this.user.id).subscribe(
                (data) => {
                    console.log(data);

                    this.transactions = data;
                },
                (error) => {
                    console.log(error);
                    this.toast("Failed getting transactions.", true);
                }
            );
        }
    }

    createPolnilnica() {
        console.log(this.newPolnilnica);
        this.magicService.createPolnilnica(this.newPolnilnica).subscribe(
            (data) => {
                console.log(data);
                this.homeComponent.polnilnice.push(data);
                this.magicService.callNovice().subscribe(
                    (data) => {
                        console.log(data);
                        this.toast("Created and emails dispatched.", true);
                    },
                    (error) => {
                        console.log(error);
                        this.toast("Created, but emails were not sent.", true);
                    }
                );
            },
            (error) => {
                console.log(error);
                this.toast("Problem accessing charging stations service.", false);
            }
        );
    }

    getDateString(timestamp: number) {
        let date = new Date(timestamp * 1000);
        return `${this.days[date.getDay()]}. ${date.getDate()} ${this.months[date.getMonth()]} ${date.getFullYear()} `;
    }

    toggleAdminModal() {
        this.showAdminPanel = !this.showAdminPanel;
    }

    delete(report: Report, listIx: number) {
        /* this.magicService.deleteReport(report.id).subscribe(
            (data) => {
                console.log(data);
                this.reportList.splice(listIx, 1);
                this.toast("Deletion successful.", true);
            },
            (error) => {
                if (error.status === 200) {
                    this.reportList.splice(listIx, 1);
                    this.toast("Deletion successful.", true);
                    return;
                }
                this.toast("Problem accessing admin service.", false);
            }
        ); */

        this.magicService.deleteOcena(report.ocenaId).subscribe(
            (data) => {
                console.log(data);
                this.toast("Deletion successful.", true);
            },
            (error) => {
                if (error.status === 200) {
                    this.magicService.deleteReport(report.id).subscribe(
                        (data) => {
                            console.log(data);
                            this.reportList.splice(listIx, 1);
                            this.toast("Deletion successful.", true);
                        },
                        (error) => {
                            if (error.status === 200) {
                                this.reportList.splice(listIx, 1);
                                this.toast("Deletion successful.", true);
                                return;
                            }
                            this.toast("Problem accessing admin service.", false);
                        }
                    );
                }
                if (error.status === 404) {
                    this.toast("Rating with this Id does not exist.", false);
                }
                this.toast("Problem accessing charging stations service.", false);
            }
        );
    }

    ngOnInit() {
        if (!this.magicService.isLoggedIn()) {
            this.router.navigate(["authentication"]);
        }
        this.user = this.magicService.loggedInUser();
        this.user_charging = this.user.charging;

        if (this.amIanAdmin()) {
            this.magicService.getReports().subscribe(
                (data) => {
                    console.log(data);
                    this.reportList = data;
                },
                (error) => {
                    console.log(error);
                    if (error.status === 404) {
                        this.reportList = [];
                        return;
                    }
                    this.toast("Problem getting admin reports", false);
                }
            );
        }
    }

    isLoggedIn(): boolean {
        return this.magicService.isLoggedIn();
    }
    logout() {
        this.showUserModal = false;
        this.magicService.setLoggedIn(false, null);
        this.router.navigate(["authentication"]);
    }

    toggleModal() {
        this.showUserModal = !this.showUserModal;
    }
    toggleModalPassword() {
        this.passwordStage = 1;
        this.showPasswordChangeModal = !this.showPasswordChangeModal;
    }

    toggleModalFunds() {
        this.showAddFundsModal = !this.showAddFundsModal;
    }

    nakaziFunds() {
        if (!this.cardNumber || this.cardNumber.length != "4987 08XX XXXX XXXX".length) {
            this.toast("Incorrect card number format.", false);
            return;
        }
        if (!this.cardCVV || this.cardCVV.length != 3) {
            this.toast("Incorrect CVV format.", false);
            return;
        }
        if (this.cardAmount < 0.5) {
            this.toast("We only accept top ups above 0.50€.", false);
            return;
        }

        this.magicService.nakaziDenar(this.user.id, this.cardAmount).subscribe(
            (data) => {
                console.log(data);
                this.toast("Funds successfuly transferred.", true);
                this.magicService.userAddFunds(this.cardAmount);
                this.showAddFundsModal = false;
            },
            (error) => {
                console.log("error: ", error);
                this.toast("Transferring funds unsucessful.\nProblem with api.", false);
            }
        );
    }

    passwordStageAction() {
        if (this.passwordStage === 1) {
            if (this.retypePassword !== this.user.password) {
                this.toast("Passwords do not match.", false);
                return;
            } else {
                this.passwordStage = 2;
                this.toast("Passwords match.\nYou can change your password now.", true);
                return;
            }
        }
        if (this.passwordStage === 2) {
            this.user.password = this.newPassword;

            this.magicService.updateUporabnik(this.user).subscribe(
                (data) => {
                    console.log(data);
                    this.toast("Password changed successfuly", true);
                    this.passwordStage = 1;
                    this.showPasswordChangeModal = false;
                },
                (error) => {
                    console.log("error: ", error);
                    this.toast("Problem with api.", false);
                }
            );
        }
    }

    deleteUser() {
        if (confirm("Are you sure you want to delete your account?\nYour funds will be lost.")) {
            this.magicService.deleteUporabnik(this.user.id).subscribe(
                (data) => {
                    console.log(data);
                    this.logout();
                },
                (error) => {
                    console.log(error);
                    this.toast("Problem with api.", false);
                }
            );
        }
    }

    amIanAdmin() {
        if (!this.user) return false;
        if (this.user.email === "admin@rso2021.com") return true;
        return false;
    }

    // Very simple toast... make sure to include html in the component you want to use:)
    toast(message: string, success: boolean) {
        this.toastMessage = message;
        // Get the snackbar DIV
        var x = document.getElementById("snackbar_sidebar");
        // Add the "show" class to DIV
        success ? (x.className = "snackbar show snackbarsuccess") : (x.className = "snackbar show snackbarerror");

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () {
            x.className = x.className.replace("snackbar show", "snackbar");
            this.toastMessage = "";
        }, 3000);
    }
}
