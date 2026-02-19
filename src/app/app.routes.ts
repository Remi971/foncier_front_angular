import { Routes } from '@angular/router';
import { LoginComponent } from './login.component/login.component';
import { ProfileComponent } from './profile.component/profile.component';
import { HomeComponent } from './home.component/home.component';
import { authGuard } from './auth-guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
    { path: '', component: HomeComponent, canActivate: [authGuard]}
    
];
