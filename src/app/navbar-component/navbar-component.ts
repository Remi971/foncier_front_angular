import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommuneApiService } from '../../services/communeApi.service';
import { MapService } from '../../services/map.service';
import { CartoApiService } from '../../services/cartoapi.service';
import { CommuneDto, CommuneResponseDto } from '../dto/commune.dto';
import { tap } from 'rxjs';
import { MapAction } from '../dto/mapAction.enum';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-navbar-component',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent  {
  communeInput: string = "";
  private communeApi = inject(CommuneApiService)
  private mapService = inject(MapService)
  communeList: Array<any> = [];
  communeNameDebounced = signal<string>("");

  constructor() {
    effect(() => {
      console.log("debounced : ", this.communeNameDebounced())
      this.communeApi.getCommuneInfo(this.communeNameDebounced()).pipe(
        tap((response) => {
          this.communeList = response
        })
      ).subscribe()
    })
  }

  debounce(): void {
    let timer: number;
    timer = setTimeout(() => this.communeNameDebounced.set(this.communeInput), 400)
  }

  updateField(e: Event): void {
    console.log("commune input event : ", e)
    if (!this.communeInput) {
      this.communeList = []
    }
    this.debounce();
  }
  clearInput(): void {
    this.communeInput = "";
    this.communeList = []
  }

  selectCommune(commune: CommuneResponseDto): void {
    // get information and save it in SessionStorage
    const { _score, ...rest } = commune
    this.mapService.communeSaved.set({...rest, data: false});
    this.mapService.requestAction(MapAction.FLY_TO);
    this.communeInput = "";
    this.communeList = [];
    // Display 'Obtenir data Button'
  }

}
