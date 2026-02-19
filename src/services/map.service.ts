import { Injectable, Signal, signal } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MapService {
   private action = signal<string>('');

    requestAction(action: string): void{
        this.action.set(action);
    }

    getAction():string {
        return this.action();
    }
}