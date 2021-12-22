import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UporabnikiComponent} from './uporabnik/uporabniki.component';
import {UporabnikPodrobnostiComponent} from './uporabnik/uporabnik-podrobnosti.component';
import {UporabnikiDodajComponent} from './uporabnik/uporabniki-dodaj.component';

const routes: Routes = [
    {path: '', redirectTo: '/uporabniki', pathMatch: 'full'},
    {path: 'uporabniki', component: UporabnikiComponent},
    {path: 'uporabniki/:id', component: UporabnikPodrobnostiComponent},
    {path: 'dodajuporabnika', component: UporabnikiDodajComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
