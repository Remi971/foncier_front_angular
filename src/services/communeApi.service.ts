import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommuneResponseDto } from "../app/dto/commune.dto";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment.prod";

@Injectable({
    providedIn: 'root'
})
export class CommuneApiService {
    http = inject(HttpClient)
    getCommuneInfo(input: string): Observable<Array<CommuneResponseDto>> {
        return this.http.get<Array<CommuneResponseDto>>(environment.apiCommune + `?nom=${input}&boost=population&limit=5&fields=code,nom,centre`);
    }
}