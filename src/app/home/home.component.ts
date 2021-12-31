import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Uporabnik } from "../uporabnik/models/uporabnik";
import { MagicService } from "../uporabnik/services/uporabnik.service";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
    constructor(private magicService: MagicService, private router: Router) {}

    private user: Uporabnik = null;

    ngOnInit() {}
}
