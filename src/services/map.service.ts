import { Injectable, signal } from "@angular/core";
import { CommuneAppDto, CommuneDto } from "../app/dto/commune.dto";
import { EnveloppeDto, EnveloppeInfoDto } from "../app/dto/enveloppe.dto";

@Injectable({
    providedIn: 'root'
})
export class MapService {
   private action = signal<string>('');
   isEnveloppe = signal<EnveloppeInfoDto | null>(null)
   isCommune = signal<CommuneAppDto | null>(null)
   communeSaved = signal<CommuneAppDto | null>(null)
   processing = signal<boolean>(false)

    requestAction(action: string): void{
        this.action.set(action);
    }

    getAction():string {
        return this.action();
    }

}