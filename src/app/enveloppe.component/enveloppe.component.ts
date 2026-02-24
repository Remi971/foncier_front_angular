import { Component, inject, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { MapAction } from '../dto/mapAction.enum';

@Component({
  selector: 'app-enveloppe.component',
  imports: [],
  templateUrl: './enveloppe.component.html',
  styleUrl: './enveloppe.component.css',
})
export class EnveloppeComponent {
  mapService = inject(MapService)
  editEnveloppeActive: boolean = false;

  constructor() {
    this.mapService.requestAction(MapAction.GET_ENVELOPPE)
  }

  removeEnveloppe(): void {
    this.mapService.requestAction(MapAction.REMOVE_ENVELOPPE);
  }

  addEnveloppe(): void {
    this.mapService.requestAction(MapAction.GET_ENVELOPPE);
  }

  editEnveloppe(): void {
    this.editEnveloppeActive = true
    this.mapService.requestAction(MapAction.EDIT_ENVELOPPE);
  }

  saveEnveloppe(): void {
    this.editEnveloppeActive = false;
    this.mapService.requestAction(MapAction.SAVE_ENVELOPPE)
  }

  cancelEditEnveloppe(): void {
    this.editEnveloppeActive = false;
    this.mapService.requestAction(MapAction.CANCEL_EDIT_ENVELOPPE)
  }
}
