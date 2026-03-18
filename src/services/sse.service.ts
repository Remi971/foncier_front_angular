import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../environments/environment.development";
import { Observable } from "rxjs";
import { MapService } from "./map.service";
import { ProcessStatus } from "../app/dto/process.dto";
import { AlertService } from "./alert.service";
@Injectable({
    providedIn: "root" 
})
export class SseService {
    eventSource: EventSource;
    mapService = inject(MapService)
    alertService = inject(AlertService)
    status = signal<string>("");

    constructor() {
        this.eventSource = new EventSource(environment.sseUrl);
    }

    // //Listen to an event
    listen(): Observable<any> {
        return new Observable((observer) => {
            this.eventSource.onmessage = (event) => {
                if (event.data) {
                    console.log("Received message: ", event.data);
                    const newData = JSON.parse(event.data)
                    observer.next(newData)
                    if (newData.status == ProcessStatus.COMPLETED || newData.status == ProcessStatus.ERROR || newData.status == ProcessStatus.FAILED) {
                        this.alertService.signalAlert.set({
                            type: newData.status,
                            message: newData.message || "An error occurred during processing",
                            duration: 3000 
                            })
                        observer.complete()

                    }
                }
            }

            this.eventSource.onerror = (error) => {
                observer.error(error)
            }
    })}

    close(): void {
        this.eventSource.close()
    }
}