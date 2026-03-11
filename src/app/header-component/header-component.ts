import { Component, inject, OnInit, signal } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router, RouterLink } from '@angular/router';
import { CartoApiService } from '../../services/cartoapi.service';
import { UserInfoDto } from '../dto/user.dto';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent implements OnInit {
  tokenService = inject(TokenService)
  cartoapiService = inject(CartoApiService)
  router = inject(Router)
  user= signal<any | null>(null);


  ngOnInit(): void {
    this.cartoapiService.getProfile().pipe(
      tap((response) => {
        console.log("user : ", response)
        this.user.set(response)
      }),
      catchError((err) => {
        console.log(err)
        throw err
      })
    ).subscribe()
  }
}
