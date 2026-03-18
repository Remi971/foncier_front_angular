import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { SseService } from '../../services/sse.service';
import { MapService } from '../../services/map.service';
import { AlertService } from '../../services/alert.service';
import { ProcessStatus } from '../dto/process.dto';

@Component({
  selector: 'app-status',
  imports: [],
  templateUrl: './status.html',
  styleUrl: './status.css',
})
export class StatusComponent implements OnInit, OnDestroy{
  private subscription: Subscription | null = null;
  private sseService = inject(SseService);
  private mapService = inject(MapService);
  private alertService = inject(AlertService);
  private notification: Array<any> = [];
  
  ngOnInit(): void {
    this.subscription = this.sseService.listen().subscribe({
      next: (data) => {
        if (data) {
          this.notification.unshift(data);
        }
      },
      complete: () => {
        this.mapService.processing.set(false)
        this.ngOnDestroy();
      },
      error: (error) => {
        console.error('Error receiving SSE:', error);
        this.mapService.processing.set(false)
        this.ngOnDestroy();
      }
    }
    )
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.sseService.close();
  }

}
