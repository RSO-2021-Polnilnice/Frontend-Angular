import { getLocaleDateTimeFormat } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Ocena } from "../uporabnik/models/ocena";
import { Polnilnica } from "../uporabnik/models/polnilnica";
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

    private polnilnice: Polnilnica[] = null;
    private modalPolnilnica: Polnilnica = null;
    private iframeurl: string = null;

    private termini1: number[] = [];
    private termini2: number[] = [];
    private termini3: number[] = [];

    private terminiSelected = 1;

    private days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    private months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    togglePolnilnicaModal(polnilnica: Polnilnica) {
        console.log(polnilnica);
        this.modalPolnilnica = polnilnica;
        if (polnilnica) this.iframeurl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAyLqGrXhhloYGDQr7B-ewm-oE7ay2x1dE&q=" + polnilnica.lokacijaLat + "," + polnilnica.lokacijaLng;
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
        afterTommorow.setDate(tomorrow.getDate() + 2);

        var startOfDay1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        var timestamp1 = Math.floor(startOfDay1.getTime() / 1000);

        var startOfDay2 = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
        var timestamp2 = Math.floor(startOfDay2.getTime() / 1000);

        var startOfDay3 = new Date(afterTommorow.getFullYear(), afterTommorow.getMonth(), afterTommorow.getDate());
        var timestamp3 = Math.floor(startOfDay3.getTime() / 1000);

        for (let i = 0; i < 48; i++) {
            // 30 min is 1800 sec
            this.termini1.push(timestamp1 + i * 1800);
            this.termini2.push(timestamp2 + i * 1800);
            this.termini3.push(timestamp3 + i * 1800);
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

    rezervirajTermin(terminStartTimestamp: number) {
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
        return `${this.days[date.getDay()]}. ${date.getDay()} ${this.months[date.getMonth()]} ${date.getFullYear()} `;
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
}
