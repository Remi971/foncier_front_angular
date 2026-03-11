import { Routes } from '@angular/router';
import { LoginComponent } from './login.component/login.component';
import { ProfileComponent } from './profile.component/profile.component';
import { EnveloppeComponent } from './enveloppe.component/enveloppe.component';
import { authGuard } from './auth-guard';
import { SigninComponent } from './signin.component/signin.component';
import { HomeComponent } from './home.component/home.component';
import { LayoutComponent } from './layout.component/layout.component';
import { AuthLayoutComponent } from './auth-layout-component/auth-layout-component';
import { PotentielComponent } from './potentiel.component/potentiel.component';
import { DashboardComponent } from './dashboard.component/dashboard.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent},
            { path: 'signin', component: SigninComponent}
        ]
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'home', component: HomeComponent, canActivate: [authGuard]},
            { path: 'enveloppe', component: EnveloppeComponent, canActivate: [authGuard]},
            { path: 'potentiel', component: PotentielComponent, canActivate: [authGuard]},
            { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]}
        ]
    },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
];
