import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.prod";
import { EnveloppeDto } from "../app/dto/enveloppe.dto";
import { UserDto, UserInfoDto } from "../app/dto/user.dto";
import { DataFormatDto } from "../app/dto/dataFormat.dto";
import { ProcessSchemaDto } from "../app/dto/process.dto";
import { CommuneInfoDto } from "../app/dto/communeInfo.dtp";
import { CommuneDto } from "../app/dto/commune.dto";

@Injectable({
    providedIn: 'root'
})
export class CartoApiService {
    constructor(private http: HttpClient){}

    orchestrate(body: ProcessSchemaDto): Observable<void> {
        return this.http.post<void>(environment.apiUrl + '/orchestrate', body)
    }

    getCommune(): Observable<CommuneDto> {
        return this.http.get<CommuneDto>(environment.apiUrl + '/data/commune');
    }

    getEnveloppe(): Observable<EnveloppeDto> {
        return this.http.get<EnveloppeDto>(environment.apiUrl + '/data/enveloppe');
    }

    getPotential(): Observable<Object> {
        return this.http.get<Object>(environment.apiUrl + '/potentiel')
    }

    getProfile(): Observable<UserInfoDto> {
        return this.http.get<UserInfoDto>(environment.apiUrl + '/users/me')
    }

    saveEnveloppe(enveloppe: DataFormatDto): Observable<EnveloppeDto> {
        // const body = JSON.stringify(enveloppe);
        console.log("enveloppe : ", enveloppe)
        return this.http.post<EnveloppeDto>(environment.apiUrl + '/data/enveloppe', enveloppe, {headers: { "Content-Type": "application/json" }})
    }

}