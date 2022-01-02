import { Component, OnInit } from "@angular/core";
import { Uporabnik } from "../uporabnik/models/uporabnik";
import { MagicService } from "../uporabnik/services/uporabnik.service";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
    selector: "app-auth",
    templateUrl: "./auth.component.html",
    styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnInit {
    public headers = new HttpHeaders({ "Content-Type": "application/json" });

    public uporabnikBaseURl = environment["uporabnikiBaseUrl"] + "/v1/uporabniki";

    public type = "login";
    public toastMessage = "";

    public uporabnikLogin: Uporabnik = new Uporabnik();
    public uporabnik: Uporabnik = new Uporabnik();
    public password2: string;

    constructor(private magicService: MagicService, private router: Router, private http: HttpClient) {}

    ngOnInit() {
        this.uporabnikLogin.email = "jk1637@student.uni-lj.si";
        this.uporabnikLogin.password = "addf";

        this.uporabnik.email = "jk1637@student.uni-lj.si";
        this.uporabnik.username = "Telebn";
        this.uporabnik.firstName = "Jan";
        this.uporabnik.lastName = "Krivec";
        this.uporabnik.password = "addf";
        this.password2 = "addf";
        this.uporabnik.yearBorn = 1998;

        if (this.magicService.isLoggedIn()) {
            this.router.navigate(["home"]);
        }
    }

    register() {
        // Input checking
        if (!this.password2 || !this.uporabnik.email || !this.uporabnik.firstName || !this.uporabnik.lastName || !this.uporabnik.yearBorn || !this.uporabnik.username) {
            this.toast("Please fill all inputs.", false);
            return;
        }
        if (this.password2 != this.uporabnik.password) {
            this.toast("Passwords should match.", false);
            return;
        }
        if (!this.validateEmail(this.uporabnik.email)) {
            this.toast("Wrong email format.", false);
            return;
        }
        if (this.uporabnik.yearBorn < 1800 || this.uporabnik.yearBorn > 2100) {
            this.toast("Please enter a year from 1800 to 2100", false);
            return;
        }
        if (2021 - this.uporabnik.yearBorn < 18) {
            this.toast("18+, sorry.", false);
            return;
        }

        this.uporabnik.funds = 0;
        this.magicService.createUporabnik(this.uporabnik).subscribe(
            (data) => {
                // Loop over received uporabniki
                console.log(data);
                this.toast("Your account has been created.\n You can now log in.", true);
            },
            (error) => {
                this.toast("Duplicate data.", false);
            }
        );
    }

    async login() {
        if (!this.uporabnikLogin.email || !this.uporabnikLogin.password) {
            this.toast("Please enter your email and password.", false);
            return;
        }
        this.magicService.getUporabniki().subscribe(
            (data) => {
                // Loop over received uporabniki
                for (let i = 0; i < data.length; i++) {
                    const user = data[i];
                    if (user.email === this.uporabnikLogin.email) {
                        if (user.password === this.uporabnikLogin.password) {
                            this.magicService.setLoggedIn(true, user);
                            this.router.navigate(["home"]);
                            return;
                        } else {
                            this.toast("Wrong password.", false);
                            return;
                        }
                    }
                }
                this.toast("No user with this email.", false);
            },
            (error) => {
                this.toast(error, false);
            }
        );
    }

    // Very simple toast... make sure to include html in the component you want to use:)
    toast(message: string, success: boolean) {
        this.toastMessage = message;
        // Get the snackbar DIV
        var x = document.getElementById("snackbar_auth");
        // Add the "show" class to DIV
        success ? (x.className = "snackbar show snackbarsuccess") : (x.className = "snackbar show snackbarerror");

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () {
            x.className = x.className.replace("snackbar show", "snackbar");
            this.toastMessage = "";
        }, 3000);
    }

    validateEmail(email: string) {
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
}
