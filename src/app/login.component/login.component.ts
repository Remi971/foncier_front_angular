import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthLayoutComponent } from "../auth-layout-component/auth-layout-component";

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  tokenService = inject(TokenService)
  router = inject(Router)
  formBuilder = inject(FormBuilder)
  form!: FormGroup;

  ngOnInit(): void {
    // this.form = this.formBuilder.group({
    //   username: [null, [Validators.required, Validators.email]],
    //   password: [null, [Validators.required]]
    // })
    this.tokenService.logout()
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    })
  }

  login():void {
    this.tokenService.login(this.form).pipe(
      tap(() => this.router.navigate(['/home'])),
      catchError(err => {
        alert('Login failed: ' + err.message || 'Unknown error');
        console.log('Login error details:', err);
        throw err;
      })
    ).subscribe();
  }
}
