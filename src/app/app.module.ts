import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {UporabnikiComponent} from './uporabnik/uporabniki.component';
import {UporabnikiDodajComponent} from './uporabnik/uporabniki-dodaj.component';
import {UporabnikPodrobnostiComponent} from './uporabnik/uporabnik-podrobnosti.component';
import {UporabnikService} from './uporabnik/services/uporabnik.service';


@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        UporabnikiComponent,
        UporabnikPodrobnostiComponent,
        UporabnikiDodajComponent
    ],
    providers: [UporabnikService],
    bootstrap: [AppComponent]
})
export class AppModule {
}

