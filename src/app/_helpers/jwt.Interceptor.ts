import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppStoreService } from '../services/app-store.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private appStore: AppStoreService
        ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let token = this.appStore.getAuth()['token'];
        console.log('JwtInterceptor current session token', token);
        request = request.clone({
            setHeaders: {
                Authorization: 'Bearer ' + token
            }
        });

        return next.handle(request);
    }
}
