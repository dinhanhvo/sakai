import { Injectable } from '@angular/core';
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
    token: '',
    username: ''
  };

  private userProfile = {
    id: 0,
    username: '',
    name: ''
  }

  private data: any = {};

  private observerbles = {};

  constructor() {
    const auth = sessionStorage.getItem('auth');
    if (auth !== null && auth.length > 0) {
      let obj = JSON.parse(auth);
      if (obj) {
        this.bAuth = true;
        this.auth = {
          username: obj.username,
          token: obj.token
        };
        const pf = sessionStorage.getItem(PROFILE);
        // @ts-ignore
        obj = JSON.parse(pf);
        if (obj) {
          this.setData(PROFILE, obj);
        }
        this.setData(LOGIN, sessionStorage.getItem(LOGIN));
      }
    }
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

  getAuth(): any {
    return { ...this.auth };
  }

  isAuth() {
    return this.bAuth;
  }

  initProfile(profile: any) {
    sessionStorage.setItem(PROFILE, JSON.stringify(profile));
    this.setData(PROFILE, profile);
  }

  login(username: string, token: any, lang: any, profile: any) {
    this.bAuth = true;
    this.auth = {
      token,
      username
    };
    console.log('current session token', token);
    sessionStorage.setItem('auth', JSON.stringify(this.auth));
    this.initProfile(profile);
    sessionStorage.setItem(LOGIN, username);
    this.setData(LOGIN, username);
  }

  logout() {
    this.bAuth = false;
    this.auth = {
      token: '',
      username: ''
    };
    sessionStorage.setItem('auth', <string>{});

    this.data = {};
    Object.values(this.observerbles).forEach(obj => {
      (obj as Subject<any>).unsubscribe();
    });
    this.observerbles = {};
  }
}
