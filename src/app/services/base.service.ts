import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class BaseService {

    defaultOptions: any = {};
    baseUrl = environment.apiUrl;

    // paramToken: string = '';
    constructor(private http: HttpClient) {
        this.defaultOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    public deleteData(uri: string): Observable<any>;
    public deleteData(uri: string, options?: any): Observable<any> {
        const url = this.baseUrl + uri;
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

    public getData(uri: string): Observable<any>;
    public getData(uri: string, options: any): Observable<any>;
    public getData(uri: string, options?: any): Observable<any> {
        const url = this.baseUrl + uri;
        if (options == null || typeof options === 'undefined') {
            options = this.defaultOptions;
        }
        console.log('GET========== options: ', options);

        return this.http.get<any>(url, options);
    }

    public postData(uri: string, body: any): Observable<any>;
    public postData(uri: string, body: any, options: any): Observable<any>;
    public postData(uri: string, body: any, options?: any): Observable<any> {
        const url = this.baseUrl + uri;
        if (options == null) {
            options = this.defaultOptions;
        }
        return this.http.post<any>(url, body, options);
    }

    public putData(uri: string, body: any, options?: any): Observable<any> {
        const url = this.baseUrl + uri;
        let sendOpts = {
            ...this.defaultOptions,
            ...options
        };
        // console.log('calling http put', sendUrl);
        return this.http.put<any>(url, body, sendOpts);
    }

    private paramToken(): string {
        // @ts-ignore
        let token = this.appStore.getAuth()['token'];
        return `?token=${token}`;
    }
}
