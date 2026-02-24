import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Event, NavigationEnd, Router, RouterEvent, RouterLink, RouterOutlet } from '@angular/router';
import { MapComponent } from './map-component/map-component';
import { CommonModule, NgClass } from '@angular/common';
import { TokenService } from '../services/token.service';
import { filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapComponent, CommonModule, RouterLink, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('cartofoncier');
  tokenService = inject(TokenService)
  intervalId: number = 0
  router = inject(Router);
  navbarClass = signal<string>('visible')
  asideClass = signal<string>('grid-cols-[minmax(250px,30%)_auto]')
  icons: Array<{id: number, path: string, iconPath: string, alt: string, dataTip: string}> = [
    {
      id: 1,
      path: '/',
      iconPath: '/home.svg',
      alt: "home icon",
      dataTip: "Homepage"
    },
    {
      id: 2,
      path: '/enveloppe',
      iconPath: '/home.svg',
      alt: "enveloppe icon",
      dataTip: "Enveloppe"
    },
    {
      id: 3,
      path: '/potentiel',
      iconPath: '/home.svg',
      alt: "Potentiel icon",
      dataTip: "Potentiel"
    }
  ];

  constructor() {
    effect(() => {
      if (this.tokenService.getToken() && !this.intervalId) {
        this.intervalId = setInterval(() => {
          console.log("Interval check for expiration token")
          this.tokenService.expirationTokenCount()?.subscribe(response => {
            if (!response && this.intervalId) {
              clearInterval(this.intervalId)
            }
          })
        }, 60000)
      }
    })

    this.router.events.pipe(
      filter((e: Event | RouterEvent): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      if (e.url == '/login' || e.url == '/signin') {
        this.navbarClass.set('hidden w-0')
        this.asideClass.set('flex')
      }
      else {
        this.navbarClass.set('visible')
        this.asideClass.set('flex')
      }
    })
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.tokenService.expirationTokenCount()
    }, 60000)

    this.router.events.pipe(
      tap((events) => {

      })
    )
  }

}
