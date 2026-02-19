import { computed, effect, Injectable, Signal, signal } from "@angular/core";
import { UserDto } from "../app/dto/user.dto";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment.prod";
import { Observable, Subscription, tap } from "rxjs";
import { LoginDto } from "../app/dto/login.dto";
import { NgForm } from "@angular/forms";
import { CartoApiService } from "./cartoapi.service";

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private TOKEN_KEY = 'accessToken';
    private token = signal<string | null>(null);
    private refreshToken = signal<string | null>(null);
    private _user = signal<UserDto | null>(null);
    readonly user = this._user.asReadonly();
    private isLoggedIn = computed(() => !!this.token() && !this.isTokenExpired(this.token()))

    constructor(
        private http: HttpClient,
        private cartoApiService : CartoApiService
    ) {
        effect(() => {
            if (this.token()) {
                sessionStorage.setItem(this.TOKEN_KEY, this.token()!);
            } else {
                sessionStorage.removeItem(this.TOKEN_KEY);
            }
        });
        // Charger le token au démarrage
        this.token.set(sessionStorage.getItem(this.TOKEN_KEY));
    }

    login(payload: NgForm): Observable<{access_token: string, refresh_token: string, token_type: string}> {
        const body = new URLSearchParams();
        body.set('username', payload.value.username);
        body.set('password', payload.value.password); 
        return this.http.post<{access_token: string, refresh_token: string, token_type: string}>(
            environment.apiUrl + '/token', 
            body.toString(), 
            {headers: { "Content-Type": "application/x-www-form-urlencoded" }}
        ).pipe(
            tap(response => {
                this.token.set(response.access_token);
                this.refreshToken.set(response.refresh_token);
            })
        );
    }
 
    logout(): void {
        this.token.set(null);
        this._user.set(null);
    }

    refresh_token(): Observable<{access_token: string, refresh_token: string, token_type: string}> {
        return this.http.post<{access_token: string, refresh_token: string, token_type: string}>(environment.apiUrl + '/refresh_token', this.refreshToken()).pipe(
            tap(response => {
                this.token.set(response.access_token);
                this.refreshToken.set(response.refresh_token);
            })
        )
    }

    getToken(): string | null{
        return this.token() || null
    }

    public isTokenExpired(token: string | null): boolean {
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp;
            const now = Math.floor(Date.now() / 1000);
            return exp < now;
        }
        return false
    }

    getCurrentUser(): Signal<UserDto | null> {
        return computed(() => this._user());
    }

    isAuthenticated(): boolean {
        return this.isLoggedIn();
    }
}