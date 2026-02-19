import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.prod";
import { EnveloppeDto } from "../app/dto/enveloppe.dto";
import { UserDto } from "../app/dto/user.dto";

@Injectable({
    providedIn: 'root'
})
export class CartoApiService {
    constructor(private http: HttpClient){}

    getEnveloppe(): Observable<EnveloppeDto> {
        return this.http.get<EnveloppeDto>(environment.apiUrl + '/data/enveloppe');
    }

    getPotential(): Observable<Object> {
        return this.http.get<Object>(environment.apiUrl + '/potentiel')
    }

    getProfile(): Observable<UserDto> {
        return this.http.get<UserDto>(environment.apiUrl + '/user/me')
    }

}