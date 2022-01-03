import { Ocena } from "./ocena";
import { Termin } from "./termin";

export class Polnilnica {
    id: number;
    ime: string;
    lokacijaLat: number;
    lokacijaLng: number;
    ocene: Ocena[];
    termini: Termin[];
    cas: number;
    mesto: string;
    razdalja: number;
    ulica: string;
}
