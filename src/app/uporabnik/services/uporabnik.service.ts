import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Uporabnik} from '../models/uporabnik';
import { Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';

@Injectable()
export class UporabnikService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});
    private url = 'http://localhost:8080/v1/uporabniki';

    constructor(private http: HttpClient) {
    }

    getUporabniki(): Observable<Uporabnik[]> {
        return this.http.get<Uporabnik[]>(this.url)
                        .pipe(catchError(this.handleError));
    }

    getUporabnik(username: string): Observable<Uporabnik> {
        const url = `${this.url}/${username}`;
        return this.http.get<Uporabnik>(url)
                        .pipe(catchError(this.handleError));
    }

    delete(username: string): Observable<string> {
        const url = `${this.url}/${username}`;
        return this.http.delete<string>(url, {headers: this.headers})
                        .pipe(catchError(this.handleError));
    }

    create(uporabnik: Uporabnik): Observable<Uporabnik> {
        return this.http.post<Uporabnik>(this.url, JSON.stringify(uporabnik), {headers: this.headers})
                        .pipe(catchError(this.handleError));
    }

    private handleError(error: any): Promise<any> {
        console.error('Prišlo je do napake', error);
        return Promise.reject(error.message || error);
    }
}

