import { Injectable, signal } from "@angular/core";
import { SignalAlertDto } from "../app/dto/signalalert.dto";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    signalAlert = signal<SignalAlertDto | null>(null)
}