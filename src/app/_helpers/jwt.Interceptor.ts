import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

import { AppStoreService } from '../services/app-store.service';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private appStore: AppStoreService
        ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        // let token = this.appStore.getAuth()['accessToken'];
        const token = sessionStorage.getItem("accessToken")
        console.log('JwtInterceptor current session token: ', token);
        // request = request.clone({
        //     setHeaders: {
        //         Authorization: `Bearer ${token}`
        //     }
        // });
        if (token && !request.url.endsWith('/signin')) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401) {
                    console.error('Unauthorized - Redirecting to login');
                }
                return throwError(err);
            })
        );
    }
}
