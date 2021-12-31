import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Uporabnik } from "../models/uporabnik";
import { Observable } from "rxjs";

import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable()
export class MagicService {
    private headers = new HttpHeaders({ "Content-Type": "application/json" });
    private url = environment["uporabnikiBaseUrl"] + "/v1/uporabniki";

    private loggedIn = false;
    private user: Uporabnik = null;

    constructor(private http: HttpClient) {
        let loggedin = JSON.parse(localStorage.getItem("logged_in"));
        if (!loggedin) {
            this.loggedIn = false;
        } else {
            this.loggedIn = loggedin;
            this.user = JSON.parse(localStorage.getItem("userJson"));
        }
    }

    loggedInUser(): Uporabnik {
        return this.user;
    }

    isLoggedIn(): boolean {
        return this.loggedIn;
    }

    setLoggedIn(newValue: boolean, user: Uporabnik) {
        this.loggedIn = newValue;
        localStorage.setItem("logged_in", JSON.stringify(newValue));
        localStorage.setItem("userJson", JSON.stringify(user));
    }

    getUporabniki(): Observable<Uporabnik[]> {
        return this.http.get<Uporabnik[]>(this.url);
    }

    getUporabnik(id: number): Observable<Uporabnik> {
        const url = `${this.url}/${id}`;
        return this.http.get<Uporabnik>(url).pipe(catchError(this.handleError));
    }

    deleteUporabnik(id: number): Observable<number> {
        return this.http.delete<number>(this.url + "/" + id, { headers: this.headers });
    }

    updateUporabnik(uporabnik: Uporabnik): Observable<Uporabnik> {
        return this.http.put<Uporabnik>(this.url + "/" + uporabnik.id, JSON.stringify(uporabnik), { headers: this.headers });
    }

    createUporabnik(uporabnik: Uporabnik): Observable<Uporabnik> {
        return this.http.post<Uporabnik>(this.url, JSON.stringify(uporabnik), { headers: this.headers });
    }

    private handleError(error: any): Promise<any> {
        console.error("Prišlo je do napake", error);
        return Promise.reject(error.message || error);
    }
}
