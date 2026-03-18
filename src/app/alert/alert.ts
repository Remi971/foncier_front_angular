import { Component, inject, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [NgClass],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class AlertComponent implements OnInit {
  alertService = inject(AlertService);
  message: string = "";
  alerType = {
    "STARTED": "alert-info",
    "PENDING": "alert-warning",
    "IN_PROGRESS": "alert-warning",
    "COMPLETED": "alert-success",
    "FAILED": "alert-error",
    "ERROR": "alert-error"
  }
  alertClass: string = '';

  ngOnInit(): void {
      if (this.alertService.signalAlert()) {
        this.message = this.alertService.signalAlert()!.message;
        this.alertClass = this.alerType[this.alertService.signalAlert()!.type] || 'alert-error';
        setTimeout(() => {
          this.alertService.signalAlert.set(null);
        }, this.alertService.signalAlert()!.duration || 3000);
      }
  }
}
