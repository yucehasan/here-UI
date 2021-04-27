import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { Router } from '@angular/router';

import {AuthService} from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    
    token: string = "";
    username: string;
    userType: string;
    constructor(
        // private router: Router,
        private authService: AuthService
    ) {
        this.authService.getToken().subscribe(token => {
            this.token = token;
            console.log("JWT INTERCEPTOR: Token retrieved " + this.token.substr(0, 5) + "...");
        })

        this.authService.getUsername().subscribe(username => {
            this.username = username;
        })

        this.authService.getUserType().subscribe(userType => {
            this.userType = userType;
        })
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if([401, 403].includes(err.status)){
                
            }

            const error = (err && err.error && err.error.message) || err.statusText;
            return throwError(error);
        }))
    }
}