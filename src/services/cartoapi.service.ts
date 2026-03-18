import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.prod";
import { EnveloppeDto } from "../app/dto/enveloppe.dto";
import { UserDto, UserInfoDto } from "../app/dto/user.dto";
import { DataFormatDto } from "../app/dto/dataFormat.dto";
import { ProcessSchemaDto } from "../app/dto/process.dto";
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

    getEnveloppe(code: string): Observable<EnveloppeDto> {
        return this.http.get<EnveloppeDto>(environment.apiUrl + `/data/enveloppe/${code}`);
    }

    getPotential(): Observable<Object> {
        return this.http.get<Object>(environment.apiUrl + '/potentiel')
    }

    getProfile(): Observable<UserInfoDto> {
        return this.http.get<UserInfoDto>(environment.apiUrl + '/users/me')
    }

    saveEnveloppe(enveloppe: string): Observable<GeoJSON.FeatureCollection> {
        return this.http.post<GeoJSON.FeatureCollection>(environment.apiUrl + '/data/save/enveloppe', enveloppe, {headers: { "Content-Type": "application/json" }})
    }

}