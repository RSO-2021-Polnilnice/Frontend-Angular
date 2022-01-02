import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Uporabnik } from "../models/uporabnik";
import { Observable } from "rxjs";

import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Racun } from "../models/racun";
import { ThrowStmt } from "@angular/compiler";
import { Polnilnica } from "../models/polnilnica";
import { Ocena } from "../models/ocena";

@Injectable()
export class MagicService {
    private headers = new HttpHeaders({ "Content-Type": "application/json" });
    private uporabnikiUrl = environment["uporabnikiBaseUrl"] + "/v1/uporabniki";
    private polnilniceUrl = environment["polnilniceBaseUrl"] + "/v1/polnilnice";
    private polnilniceGraphQlUrl = environment["polnilniceBaseUrl"] + "/graphql";
    private racuniUrl = environment["racuniBaseUrl"] + "/v1/placila";

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

    //================ RACUNI ================
    getRate(): Observable<number> {
        return this.http.get<number>(this.racuniUrl + "/cenik");
    }

    reserve(racun: Racun): Observable<Racun> {
        let body = { racun: racun, u_host: environment["uporabnikiBaseUrl"], p_host: environment["polnilniceBaseUrl"] };
        return this.http.post<Racun>(this.racuniUrl + "/rezerviraj", JSON.stringify(body), { headers: this.headers });
    }
    //================/ RACUNI ================

    //================ POLNILNICE ================
    getPolnilniceGraphQL(): Observable<Polnilnica[]> {
        let graphqlJson = `
		query allPolnilnice {
		   allPolnilnice(pagination: {offset: 0, limit: 10},
									sort: {fields: [{field: "id", order: ASC}]}) {
			result {
				id
				ime
			}
			pagination {
			  offset
			  limit
			  total
			}
		  }
		}`;
        return this.http.post<Polnilnica[]>(this.polnilniceGraphQlUrl, graphqlJson, { headers: this.headers });
    }

    getPolnilnice(): Observable<Polnilnica[]> {
        return this.http.get<Polnilnica[]>(this.polnilniceUrl);
    }
    getPolnilnica(polnilnicaId: number): Observable<Polnilnica> {
        return this.http.get<Polnilnica>(this.polnilniceUrl + "/" + polnilnicaId);
    }

    postComment(comment: Ocena, polnilnicaId: number): Observable<Ocena> {
        return this.http.post<Ocena>(this.polnilniceUrl + "/" + polnilnicaId + "/ocene", JSON.stringify(comment), { headers: this.headers });
    }
    //================/ POLNILNICE ================

    //================ RACUNI/NAKAZILA ================
    getRacuni(uporabnikId: Number): Observable<Racun[]> {
        return this.http.get<Racun[]>(this.racuniUrl + "/" + uporabnikId);
    }
    nakaziDenar(uporabnikId: Number, nakaziloAmount: Number): Observable<Racun> {
        return this.http.post<Racun>(this.racuniUrl + "/nakazi_/" + uporabnikId, JSON.stringify({ u_host: environment["uporabnikiBaseUrl"], nakazilo: nakaziloAmount }), { headers: this.headers });
    }

    userAddFunds(funds: number) {
        this.user.funds += funds;
        this.updateLocalStorageUser(this.user);
    }

    //================/ RACUNI/NAKAZILA ================

    // ================ UPORABNIK ================
    updateLocalStorageUser(user: Uporabnik) {
        localStorage.setItem("userJson", JSON.stringify(user));
    }

    loggedInUser(): Uporabnik {
        return this.user;
    }

    isLoggedIn(): boolean {
        return this.loggedIn;
    }

    setLoggedIn(newValue: boolean, user: Uporabnik) {
        this.loggedIn = newValue;
        this.user = user;
        localStorage.setItem("logged_in", JSON.stringify(newValue));
        localStorage.setItem("userJson", JSON.stringify(user));
    }

    getUporabniki(): Observable<Uporabnik[]> {
        return this.http.get<Uporabnik[]>(this.uporabnikiUrl);
    }

    getUporabnik(id: number): Observable<Uporabnik> {
        const url = `${this.uporabnikiUrl}/${id}`;
        return this.http.get<Uporabnik>(url).pipe(catchError(this.handleError));
    }

    deleteUporabnik(id: number): Observable<number> {
        return this.http.delete<number>(this.uporabnikiUrl + "/" + id, { headers: this.headers });
    }

    updateUporabnik(uporabnik: Uporabnik): Observable<Uporabnik> {
        return this.http.put<Uporabnik>(this.uporabnikiUrl + "/" + uporabnik.id, JSON.stringify(uporabnik), { headers: this.headers });
    }

    createUporabnik(uporabnik: Uporabnik): Observable<Uporabnik> {
        return this.http.post<Uporabnik>(this.uporabnikiUrl, JSON.stringify(uporabnik), { headers: this.headers });
    }
    // ================/ UPORABNIK ================

    private handleError(error: any): Promise<any> {
        console.error("Prišlo je do napake", error);
        return Promise.reject(error.message || error);
    }
}
