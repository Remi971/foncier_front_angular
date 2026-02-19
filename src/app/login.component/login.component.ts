import { Component, inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { FormsModule, NgForm } from '@angular/forms';
import { catchError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDto } from '../dto/login.dto';

@Component({
  selector: 'app-login.component',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  tokenService = inject(TokenService)
  router = inject(Router)
  username: string = "";
  password: string = "";

  login(ngform: NgForm):void {
    this.tokenService.login(ngform).pipe(
      tap(() => this.router.navigate(['/'])),
      catchError(err => {
        alert('Login failed: ' + err.message || 'Unknown error');
        console.log('Login error details:', err);
        throw err;
      })
    ).subscribe();
  }
}
