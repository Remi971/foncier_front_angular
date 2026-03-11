import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Event, NavigationEnd, Router, RouterEvent, RouterLink, RouterOutlet } from '@angular/router';
import { MapComponent } from './map-component/map-component';
import { CommonModule, NgClass } from '@angular/common';
import { TokenService } from '../services/token.service';
import { filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('cartofoncier');
  tokenService = inject(TokenService)
  intervalId: number = 0
  router = inject(Router);

  constructor() {
    effect(() => {
      if (this.tokenService.getToken() && !this.intervalId) {
        this.intervalId = setInterval(() => {
          console.log("Interval check for expiration token")
          this.tokenService.expirationTokenCount()?.subscribe(response => {
            if (!response) {
              if (this.intervalId){
                clearInterval(this.intervalId)
              }
              this.router.navigate(["/auth/login"])
            } 
          })
        }, 1000)
      }
    })
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.tokenService.expirationTokenCount()?.subscribe()
    }, 1000)

    // this.router.events.pipe(
    //   tap((events) => {

    //   })
    // )
  }

}
