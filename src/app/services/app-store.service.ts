import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

// @ts-ignore
@Injectable({
    providedIn: 'root'
})

const PROFILE = 'profile';
const LOGIN = 'login';

export const AppStore = {
    PROFILE,
    LOGIN,
}

export class AppStoreService {

    private bAuth: boolean = false;
    private auth = {
        accessToken: '',
        tokenType: 'Bearer ',
        username: '',
        id: 0
    };

    private data: any = {};

    private observerbles = {};

    constructor() {
    }

    getData(key: string, defValue: any): any {
        // @ts-ignore
        if (this.data[key]) {
            // @ts-ignore
            return this.data[key];
        }
        return defValue;
    }

    setData(key: string, value: any): any {
        // @ts-ignore
        this.data[key] = value;
        //console.log('set data', key, value);
        // @ts-ignore
        if (this.observerbles[key]) {
            console.log('notify value change', key, value);
            // @ts-ignore
            this.observerbles[key].next(value);
        }
    }

    setAuth(auth: { accessToken: string; tokenType: string; username: string; id: number}) {
        this.auth = auth;
        this.bAuth = true;
        sessionStorage.setItem('isAuthenticated', String(this.bAuth));
        console.log('------- save to session: ' + auth.accessToken)
        sessionStorage.setItem('accessToken', auth.accessToken);
    }
    getAuth(): any {
        return {...this.auth};
    }

    isAuth() {
        return this.bAuth;
    }

    initProfile(profile: any) {
        // sessionStorage.setItem(PROFILE, JSON.stringify(profile));
        sessionStorage.setItem('auth', JSON.stringify(this.auth));
        this.setData(PROFILE, profile);
    }

  // login(username: string, token: any, lang: any, profile: any) {
  //   this.bAuth = true;
  //   this.auth = {
  //     token,
  //     username
  //   };
  //   console.log('current session token', token);
  //   sessionStorage.setItem('auth', JSON.stringify(this.auth));
  //   this.initProfile(profile);
  //   sessionStorage.setItem(LOGIN, username);
  //   this.setData(LOGIN, username);
  // }

  logout() {
    this.bAuth = false;
    sessionStorage.setItem('isAuthenticated', String(this.bAuth));
    sessionStorage.setItem('auth', <string>{});

    this.data = {};
    Object.values(this.observerbles).forEach(obj => {
      (obj as Subject<any>).unsubscribe();
    });
    this.observerbles = {};
  }
}
