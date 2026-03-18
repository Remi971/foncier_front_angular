import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommuneApiService } from '../../services/communeApi.service';
import { catchError, tap } from 'rxjs';
import { CommuneDto, CommuneResponseDto } from '../dto/commune.dto';
import { MapService } from '../../services/map.service';
import { MapAction } from '../dto/mapAction.enum';
import { CartoApiService } from '../../services/cartoapi.service';
import { CommuneProcess, ProcessSchemaDto, ProcessType } from '../dto/process.dto';
import { CommuneInfoDto } from '../dto/communeInfo.dtp';
import { LayoutComponent } from "../layout.component/layout.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home.component',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  mapService = inject(MapService)
  cartoApiService = inject(CartoApiService)
  communeList: Array<any> = [];
  communeNameDebounced = signal<string>("");

  constructor(){
    if (!this.mapService.communeSaved()) {
      this.cartoApiService.getCommune().pipe(
        tap((response: CommuneDto) => {
          if (response) {
            const dataResponse = {...response, data: true}
            this.mapService.communeSaved.set(dataResponse)
            this.mapService.isCommune.set(dataResponse)
            // this.mapService.requestAction(MapAction.FLY_TO)
          }
        })
      ).subscribe()
    }

    effect(() => {
      if (this.mapService.isEnveloppe() && this.mapService.communeSaved()?.code != this.mapService.isEnveloppe()?.code) {
        this.mapService.requestAction(MapAction.REMOVE_ENVELOPPE)
      }
    })
  }
  downloadDataCommune(): void {
    const body : ProcessSchemaDto = {
      type : ProcessType.DATA_DOWNLOAD,
      parameters: this.mapService.communeSaved()!
    }
    this.cartoApiService.orchestrate(body).pipe(
      tap(() => this.mapService.processing.set(true)),
      catchError((err) => {
        console.log(err)
        this.mapService.processing.set(false);
        throw err
      })
    ).subscribe()
  }

  changeCommune(): void {
    this.mapService.communeSaved.set(this.mapService.isCommune())
  }
}
