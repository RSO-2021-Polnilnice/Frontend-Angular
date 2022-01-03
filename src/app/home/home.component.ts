import { getLocaleDateTimeFormat } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Ocena } from "../uporabnik/models/ocena";
import { Polnilnica } from "../uporabnik/models/polnilnica";
import { Racun } from "../uporabnik/models/racun";
import { Report } from "../uporabnik/models/report";
import { Termin } from "../uporabnik/models/termin";
import { Uporabnik } from "../uporabnik/models/uporabnik";
import { MagicService } from "../uporabnik/services/uporabnik.service";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
    constructor(private magicService: MagicService, private router: Router) {}

    public polnilnice: Polnilnica[] = null;
    public modalPolnilnica: Polnilnica = null;
    public modalPolnilnicaIx: number = null;
    public iframeurl: string = null;

    public termini1: number[] = [];
    public termini2: number[] = [];
    public termini3: number[] = [];
    public timestamp1: number = null;
    public timestamp2: number = null;
    public timestamp3: number = null;

    public zasedeno: number[] = [];

    public terminiSelected = 1;

    public days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    public months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    public addOcena: Ocena = new Ocena();
    public stars: boolean[] = [false, false, false, false, false];
    public text: string = "";
    public isCommentModalOpen: boolean = false;

    public toastMessage: String = "";

    getTimeInMins(time: number) {
        return Math.floor(time / 30);
    }

    searchWithExternalApi() {
        this.magicService.getPosition().then((pos) => {
            console.log(`Positon: ${pos.lng} ${pos.lat}`);
            this.magicService.callIskanjeApi(pos.lat, pos.lng, this.polnilnice).subscribe(
                (data) => {
                    console.log(data);

                    this.polnilnice = data;
                },
                (error) => {
                    console.log("error: ", error);
                }
            );
        });
    }

    togglePolnilnicaModal(polnilnica: Polnilnica, ix: number) {
        console.log(polnilnica);
        this.modalPolnilnica = polnilnica;
        this.modalPolnilnicaIx = ix;
        if (polnilnica) {
            this.calculateTermini(this.terminiSelected);
            if (polnilnica) this.iframeurl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAyLqGrXhhloYGDQr7B-ewm-oE7ay2x1dE&q=" + polnilnica.lokacijaLat + "," + polnilnica.lokacijaLng;
        }
    }

    ngOnInit() {
        this.magicService.getPolnilnice().subscribe(
            (data) => {
                console.log(data);
                this.polnilnice = data;
            },
            (error) => {
                console.log("error: ", error);
            }
        );

        const today = new Date();
        const tomorrow = new Date(today);
        const afterTommorow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        afterTommorow.setDate(tomorrow.getDate() + 1);

        var startOfDay1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.timestamp1 = Math.floor(startOfDay1.getTime() / 1000);

        var startOfDay2 = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
        this.timestamp2 = Math.floor(startOfDay2.getTime() / 1000);

        var startOfDay3 = new Date(afterTommorow.getFullYear(), afterTommorow.getMonth(), afterTommorow.getDate());
        this.timestamp3 = Math.floor(startOfDay3.getTime() / 1000);

        for (let i = 0; i < 48; i++) {
            // 30 min is 1800 sec
            let ts1 = this.timestamp1 + i * 1800;
            let ts2 = this.timestamp2 + i * 1800;
            let ts3 = this.timestamp3 + i * 1800;
            this.termini1.push(ts1);
            this.termini2.push(ts2);
            this.termini3.push(ts3);
        }

        /* for (let i = 0; i < this.termini1.length; i++) {
            console.log(this.getTimeString(this.termini1[i]));
            console.log(this.getDateString(this.termini1[i]));
        } */

        /* this.magicService.getPolnilniceGraphQL().subscribe(
            (data) => {
                console.log(data);
                this.polnilnice = data;
            },
            (error) => {
                console.log("error: ", error);
            }
        ); */
    }

    report(ocena: Ocena) {
        if (confirm(`Do you really want to report comment "${ocena.besedilo}"?`)) {
            let r: Report = new Report();
            r.komentar = ocena.besedilo;
            r.ocenaId = ocena.id;
            r.userId = ocena.userId;

            this.magicService.reportComment(r).subscribe(
                (data) => {
                    console.log(data);
                    this.toast("successfuly reported", true);
                },
                (error) => {
                    console.log(error);
                    if (error.status === 409) {
                        this.toast("This comment was already reported and should be deleted soon. Thanks.", false);
                        return;
                    }

                    this.toast("Something went wrong.", false);
                }
            );
        }
    }

    calculateTermini(day: number) {
        let termini: number[];
        if (day === 1) termini = this.termini1;
        if (day === 2) termini = this.termini2;
        if (day === 3) termini = this.termini3;

        (this.zasedeno = []).length = termini.length;
        this.zasedeno.fill(0);

        let loggedinId = this.magicService.loggedInUser().id;

        for (let i = 0; i < this.modalPolnilnica.termini.length; i++) {
            let from = this.modalPolnilnica.termini[i].dateFrom;
            let userid = this.modalPolnilnica.termini[i].userId;
            for (let j = 0; j < termini.length; j++) {
                const element = termini[j];
                if (Math.abs(from - termini[j]) < 5) {
                    if (loggedinId !== userid) {
                        this.zasedeno[j] = 2;
                    } else {
                        this.zasedeno[j] = 1;
                    }
                }
            }
        }
    }

    toggleCommentModal() {
        if (this.isCommentModalOpen) this.setStars(-1);
        this.isCommentModalOpen = !this.isCommentModalOpen;
    }
    setStars(i: number) {
        for (let k = 0; k < this.stars.length; k++) {
            this.stars[k] = false;
        }
        for (let j = 0; j <= i; j++) {
            this.stars[j] = true;
        }
    }

    comment() {
        let rating = 0;
        for (let i = 0; i < this.stars.length; i++) {
            if (this.stars[i]) rating++;
        }
        if (rating === 0) {
            this.toast("Please provide a rating.", false);
            return;
        }
        if (this.text.length < 2) {
            this.toast("Comment should be atleast 2 characters long", false);
            return;
        }
        this.addOcena.ocena = rating;
        this.addOcena.besedilo = this.text;
        this.addOcena.userId = this.magicService.loggedInUser().id;
        this.magicService.postComment(this.addOcena, this.modalPolnilnica.id).subscribe(
            (data) => {
                console.log(data);
                this.polnilnice[this.modalPolnilnicaIx].ocene.unshift(data);
                this.toast("Comment was successfuly added.", true);
            },
            (error) => {
                console.log("error: ", error);
                this.toast("Error while adding comment.", false);
            }
        );
    }

    rezervirajTermin(terminStartTimestamp: number, day: number, terminIx: number) {
        if (this.zasedeno[terminIx] !== 0) {
            this.toast("Sorry, already booked", false);
            return;
        }

        let endStamp: number = terminStartTimestamp + 1799;
        this.magicService.getRate().subscribe(
            (data) => {
                let price: number = 0.5 * data;
                let u = this.magicService.loggedInUser();
                if (u.funds < price) {
                    this.toast("Not enough funds", false);
                    return;
                }

                if (confirm(`Do you sure you want to book this charging station from ${this.getTimeString(terminStartTimestamp)} to ${this.getTimeString(endStamp)} for ${price}€ (At rate ${data}€/hr)?`)) {
                    // Save it!
                    let r = new Racun();

                    r.customerEmail = u.email;
                    r.customerUsername = u.username;
                    r.customerFirstName = u.firstName;
                    r.customerLastName = u.lastName;
                    r.customerId = u.id;
                    r.polnilnicaId = this.modalPolnilnica.id;
                    r.price = price;
                    r.terminDateFrom = terminStartTimestamp;
                    r.terminDateTo = endStamp;

                    this.magicService.reserve(r).subscribe(
                        (data) => {
                            u.funds -= price;
                            this.magicService.setLoggedIn(true, u);

                            console.log(data);
                            let termin = new Termin();
                            termin.dateFrom = r.terminDateFrom.valueOf();
                            termin.dateTo = r.terminDateTo.valueOf();
                            termin.userId = r.customerId.valueOf();

                            this.polnilnice[this.modalPolnilnicaIx].termini.push(termin);
                            this.calculateTermini(day);
                            this.toast("Booking successful.", true);
                        },
                        (error) => {
                            console.log("error: ", error);
                            this.toast("Error occured while booking.", false);
                        }
                    );
                }
            },
            (error) => {
                console.log("error: ", error);
                this.toast("Sorry, it appears our transaction service is unavailable.", false);
            }
        );

        console.log(terminStartTimestamp + " -> " + (terminStartTimestamp + 1799));
    }

    getTimeString(timestamp: number) {
        let date = new Date(timestamp * 1000);
        var minutes = "0" + date.getMinutes();
        var hours = "0" + date.getHours();
        return hours.substr(-2) + ":" + minutes.substr(-2);
    }

    getDateString(timestamp: number) {
        let date = new Date(timestamp * 1000);
        return `${this.days[date.getDay()]}. ${date.getDate()} ${this.months[date.getMonth()]} ${date.getFullYear()} `;
    }

    getAverageOcena(id: number) {
        let ocene: Ocena[] = this.polnilnice.find((polnilnica) => polnilnica.id === id).ocene;
        let avg = 0;
        for (let i = 0; i < ocene.length; i++) {
            avg += ocene[i].ocena;
        }
        avg = avg / ocene.length;
        if (isNaN(avg)) {
            return null;
        }
        return Math.round(avg * 10) / 10;
    }

    // Very simple toast... make sure to include html in the component you want to use:)
    toast(message: string, success: boolean) {
        this.toastMessage = message;
        // Get the snackbar DIV
        var x = document.getElementById("snackbar_home");
        // Add the "show" class to DIV
        success ? (x.className = "snackbar show snackbarsuccess") : (x.className = "snackbar show snackbarerror");

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () {
            x.className = x.className.replace("snackbar show", "snackbar");
            this.toastMessage = "";
        }, 3000);
    }
}
