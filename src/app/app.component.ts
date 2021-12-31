import { Component } from "@angular/core";
import { MagicService } from "./uporabnik/services/uporabnik.service";
import { Router } from "@angular/router";

@Component({
    moduleId: module.id,
    selector: "prpo-app",
    template: `<router-outlet></router-outlet> `,
})
export class AppComponent {
    // Redirect if not logged in
    constructor(magicService: MagicService, router: Router) {
        if (!magicService.isLoggedIn()) {
            console.log("redirect ");

            router.navigate(["authentication"]);
        }
    }
}
