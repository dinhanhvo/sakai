import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable, } from "rxjs";
import {BaseService} from "./base.service";

const API_USERS: string = '/users';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    baseUrl = environment.apiUrl;

    constructor(private baseService: BaseService
  ) { }

  public login(user: string, credentials: string): Observable<any> {
    let loginUrl = this.baseUrl +  '/auth/login';
    console.log('Login to Dashboard using API url: ' + loginUrl);
    let body = {
      username: user,
      password: credentials
    };
    return this.baseService.postData(loginUrl, body)

  }

}
