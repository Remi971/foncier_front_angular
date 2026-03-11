import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MapComponent } from '../map-component/map-component';
import { CommonModule, NgClass } from '@angular/common';
import { HeaderComponent } from '../header-component/header-component';
import { NavbarComponent } from "../navbar-component/navbar-component";

@Component({
  selector: 'app-layout-component',
  imports: [MapComponent, CommonModule, HeaderComponent, NavbarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {

}
