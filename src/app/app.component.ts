import {Component} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'prpo-app',
    template: `
        <h1>{{naslov}}</h1>
        <router-outlet></router-outlet>
    `
})
export class AppComponent {
    naslov = 'PRPO: Primer spletne aplikacije';
}
