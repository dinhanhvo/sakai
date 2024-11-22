import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  defaultOptions: any = {};
  // paramToken: string = '';
  constructor(private http: HttpClient) {
    this.defaultOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  public deleteData(url: string): Observable<any>;
  public deleteData(url: string, options?: any): Observable<any> {
    url =  url + this.paramToken();
    let opts = null;
    if (options == null || typeof options === 'undefined') {
      opts = this.defaultOptions;
    } else {
      opts = {
        ...this.defaultOptions,
        ...options
      };
    }
    return this.http.delete<any>(url, opts);
  }

  public getData(url: string): Observable<any>;
  public getData(url: string, options: any): Observable<any>;
  public getData(url: string, options?: any): Observable<any> {
    if (options == null || typeof options === 'undefined') {
      options = this.defaultOptions;
    }
    console.log('GET========== options: ', options);

    return this.http.get<any>(url, options);
  }

  public postData(url: string, body: any): Observable<any>;
  public postData(url: string, body: any, options: any): Observable<any>;
  public postData(url: string, body: any, options?: any): Observable<any> {
    if (options == null) {
      options = this.defaultOptions;
    }
    return this.http.post<any>(url, body, options);
  }

  public putData(url: string, body: any, options?: any): Observable<any> {
    let sendUrl =  url + this.paramToken();
    let sendOpts = {
      ...this.defaultOptions,
      ...options
    };
    // console.log('calling http put', sendUrl);
    return this.http.put<any>(sendUrl, body, sendOpts);
  }

  public getUrlWithToken(url: string) {
    return  url + this.paramToken();
  }

  private paramToken(): string {
    // @ts-ignore
    let token = this.appStore.getAuth()['token'];
    return `?token=${token}`;
  }
}
