import {Injectable} from '@angular/core';
import {Observable,} from "rxjs";
import {BaseService} from "./base.service";

const API_USERS: string = '/users';
const URI_LOGIN: string = '/auth/signin'

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private baseService: BaseService
    ) {
    }

    public login(user: string, credentials: string): Observable<any> {
        const body = {
            username: user,
            password: credentials
        };
        return this.baseService.postData(URI_LOGIN, body)

    }

}
