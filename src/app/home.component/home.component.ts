import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { RouterLink } from "@angular/router";
import { MapService } from '../../services/map.service';
import { MapAction } from '../dto/mapAction.enum';

@Component({
  selector: 'app-home.component',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
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
