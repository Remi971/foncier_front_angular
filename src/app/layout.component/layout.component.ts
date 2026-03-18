import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MapComponent } from '../map-component/map-component';
import { CommonModule, NgClass } from '@angular/common';
import { HeaderComponent } from '../header-component/header-component';
import { NavbarComponent } from "../navbar-component/navbar-component";
import { MapService } from '../../services/map.service';
import { StatusComponent } from '../status/status';
import { AlertComponent } from '../alert/alert';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-layout-component',
  imports: [MapComponent, CommonModule, HeaderComponent, NavbarComponent, RouterOutlet, StatusComponent, AlertComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  mapService = inject(MapService)
  alertSignal = inject(AlertService)

}
