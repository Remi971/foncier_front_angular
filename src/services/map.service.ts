import { Injectable, signal } from "@angular/core";
import { CommuneAppDto, CommuneDto } from "../app/dto/commune.dto";

@Injectable({
    providedIn: 'root'
})
export class MapService {
   private action = signal<string>('');
   isEnveloppe = signal<boolean>(false)
   isCommune = signal<CommuneAppDto | null>(null)
   communeSaved = signal<CommuneAppDto | null>(null)
   processing = signal<boolean>(false)

    requestAction(action: string): void{
        this.action.set(action);
    }

    getAction():string {
        return this.action();
    }

    requestEnveloppe(presence: boolean): void {
        this.isEnveloppe.set(presence);
    }
}