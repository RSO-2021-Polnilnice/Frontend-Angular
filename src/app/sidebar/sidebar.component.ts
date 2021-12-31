import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Uporabnik } from "../uporabnik/models/uporabnik";
import { MagicService } from "../uporabnik/services/uporabnik.service";

declare var $: any;

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
    constructor(private magicService: MagicService, private router: Router) {}

    private user: Uporabnik = null;
    private retypePassword: String = "";
    private newPassword = "";
    private passwordStage: Number = 1;

    private user_charging: Boolean = false;

    private showUserModal: Boolean = false;
    private showPasswordChangeModal: Boolean = false;

    private toastMessage: String = "";

    ngOnInit() {
        if (!this.magicService.isLoggedIn()) {
            this.router.navigate(["authentication"]);
        }
        this.user = this.magicService.loggedInUser();
        this.user_charging = this.user.charging;
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

    passwordStageAction() {
        if (this.passwordStage === 1) {
            if (this.retypePassword !== this.user.password) {
                this.toast("Passwords do not match.", false);
            } else {
                this.passwordStage = 2;
                this.toast("Passwords match.\nYou can change your password now.", true);
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
                    this.toast("Problem with api.", false);
                }
            );
        }
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
