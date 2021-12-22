import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';

import { switchMap } from 'rxjs/operators';

import {Uporabnik} from './models/uporabnik';
import {UporabnikService} from './services/uporabnik.service';

@Component({
    moduleId: module.id,
    selector: 'uporabnik-podrobnosti',
    templateUrl: 'uporabnik-podrobnosti.component.html'
})
export class UporabnikPodrobnostiComponent implements OnInit {
    uporabnik: Uporabnik;

    constructor(private uporabnikService: UporabnikService,
                private route: ActivatedRoute,
                private location: Location) {
    }

    ngOnInit(): void {
       this.route.params.pipe(
            switchMap((params: Params) => this.uporabnikService.getUporabnik(+params['id'])))
            .subscribe(uporabnik => this.uporabnik = uporabnik);
    }

    nazaj(): void {
        this.location.back();
    }
}
