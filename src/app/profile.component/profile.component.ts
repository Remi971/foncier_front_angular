import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { UserDto } from '../dto/user.dto';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile.component',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private tokenService = inject(TokenService)
  router = inject(Router)
  user = this.tokenService.getCurrentUser();
  isLoggedIn = this.tokenService.isAuthenticated();

  logout(): void {
    this.tokenService.logout();
    this.router.navigate(['/login'])
  }
}
