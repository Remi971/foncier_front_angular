import { computed, effect, Injectable, Signal, signal } from "@angular/core";
import { UserDto } from "../app/dto/user.dto";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment.prod";
import { catchError, Observable, Subscription, tap } from "rxjs";
import { LoginDto } from "../app/dto/login.dto";
import { FormGroup, NgForm } from "@angular/forms";
import { CartoApiService } from "./cartoapi.service";
import { TokenDto } from "../app/dto/token.dto";

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

    login(payload: FormGroup): Observable<TokenDto> {
        const body = new URLSearchParams();
        body.set('username', payload.value.username);
        body.set('password', payload.value.password); 
        return this.http.post<TokenDto>(
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

    signin(payload: FormGroup): Observable<TokenDto> {
        const body = new URLSearchParams();
        body.set("username", payload.value.username)
        body.set("password", payload.value.password)
        body.set("firstname", payload.value.firstname)
        body.set("lastname", payload.value.lastname)
        return this.http.post<TokenDto>(
            environment.apiUrl + '/signin', 
            body.toString(), 
            {headers: {"Content-type": "application/x-www-form-urlencoded"}})
        .pipe(
            tap(response => {
                this.token.set(response.access_token)
                this.refreshToken.set(response.refresh_token)
            })
        )
    }
 
    logout(): void {
        this.token.set(null);
        this._user.set(null);
    }

    refresh_token(): Observable<TokenDto> {
        return this.http.post<TokenDto>(environment.apiUrl + '/refresh_token', {headers: { "Authorization": `Bearer ${this.refreshToken}`}}).pipe(
            tap(response => {
                this.token.set(response.access_token);
                this.refreshToken.set(response.refresh_token);
            })
        )
    }

    getToken(): string | null{
        return this.token() || null
    }

    expirationTokenCount(): Observable<TokenDto> | null {
        if (this.token()) {
            const exp = this.parseJwt(this.token()!).exp
            const count = Math.floor(exp - Date.now() / 1000)
            if (count <= 0) {
                console.log("REFRESH TOKEN !!!!")
                return this.refresh_token().pipe(
                    catchError((error) => {
                        console.log(error)
                        this.logout()
                        throw error
                    })
                )
            }
        }
        return null
    }

    parseJwt(token: string): {exp: number} {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join(''),
    )
    console.log("from parseJwt : ", JSON.parse(jsonPayload))
    return JSON.parse(jsonPayload)
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