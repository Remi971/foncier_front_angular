import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { TokenService } from "../services/token.service";
import { catchError, Observable } from "rxjs";
import { Router } from "@angular/router";

export function tokenInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const tokenService = inject(TokenService)
    const token = tokenService.getToken();
    const router = inject(Router)
    console.log("token : ", token)
    if (token) {
        // check expiration
        if (tokenService.isTokenExpired(token)) {
            console.warn("Token expired, logging out");
            // Refresh token
            tokenService.refresh_token().pipe(
                catchError(err => {
                    console.log("Token refresh failed, logging out", err);
                    tokenService.logout();
                    router.navigate(['/login']);
                    throw err;
                })
            )
            return next(req);
        }
        const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(cloned);
    }
    return next(req)
}