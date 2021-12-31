import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PolnilniceComponent } from "./polnilnice/polnilnice.component";
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./auth/auth.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

const routes: Routes = [
    { path: "notfound", component: NotfoundComponent },
    { path: "authentication", component: AuthComponent },
    { path: "home", component: HomeComponent },
    { path: "polnilnice", component: PolnilniceComponent },
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "**", redirectTo: "notfound", pathMatch: "full" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
