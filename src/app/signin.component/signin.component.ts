import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { catchError, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin.component',
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent implements OnInit {
  tokenService = inject(TokenService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  form!: FormGroup;
  confirm: string = "";

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      username: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }

  signin(): void {
    if (this.form.value.password === this.confirm) {
      this.tokenService.signin(this.form)
      .pipe(
        tap(() => {
        this.router.navigate(['/'])
      }),
      catchError(err => {
        alert('Signin failed: ' + err?.error?.detail || "Unknown error");
        console.log('Signin error details: ', err);
        throw err;
      })
    )
      .subscribe()
    } else {
      alert("Veuillez entrer exactement le même mot de passe pour la confirmation. ")
    }
  }
}
