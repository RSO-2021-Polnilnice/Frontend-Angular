import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { MagicService } from "./uporabnik/services/uporabnik.service";
import { PolnilniceComponent } from "./polnilnice/polnilnice.component";
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./auth/auth.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { SafePipePipe } from "./safe-pipe.pipe";

@NgModule({
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
    declarations: [AppComponent, PolnilniceComponent, HomeComponent, AuthComponent, NotfoundComponent, SidebarComponent, SafePipePipe],
    providers: [MagicService],
    bootstrap: [AppComponent],
})
export class AppModule {}
