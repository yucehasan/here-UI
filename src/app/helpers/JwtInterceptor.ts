import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    token: string = "";
    refreshToken: string ="";
    username: string;
    userType: string;
    SERVER_URL: string = "https://hereapp-live.herokuapp.com/token/refresh";
    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private authService: AuthService
    ) {
        this.authService.getToken().subscribe(token => {
            this.token = token;
            console.log("JWT INTERCEPTOR: Token retrieved " + this.token.substr(0, 5) + "...");
        })

        this.authService.getRefreshToken().subscribe(refreshToken => {
            this.refreshToken = refreshToken;
        })
        this.authService.getUsername().subscribe(username => {
            this.username = username;
        })

        this.authService.getUserType().subscribe(userType => {
            this.userType = userType;
        })
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // TODO: https://jasonwatmore.com/post/2020/07/25/angular-10-jwt-authentication-with-refresh-tokens#jwt-interceptor-ts

        var isLoggedIn = this.token.length > 0;
        if (isLoggedIn) {
            console.log("INTERCEPT: " + this.token.substr(0, 5) + "...");
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${this.token}` }
            });
        }

        return next.handle(request).pipe(catchError(err => {

            console.log("Error catched");
            console.log(err);
            console.log(typeof err);
            if (this.token.length === 0) {
                this.router.navigate(['/auth']);
            }

            if(err === "UNAUTHORIZED"){
                const headers = new HttpHeaders().set(
                    'Authorization',
                    'Bearer ' + this.refreshToken
                  );
                this.httpClient.post<any>(this.SERVER_URL, {headers: headers})
                .subscribe((res) => {
                    this.authService.updateToken(res.access_token)
                })

                console.log("JWT INTERCEPTOR: Token Refreshed");
            }
            const error = (err && err.error && err.error.message) || err.statusText;
            return throwError(error);
        })

        );

    }
}