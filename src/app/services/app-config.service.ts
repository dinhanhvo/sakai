import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: any = null;

  constructor(private http: HttpClient) { }

  /**
   * Get configuration value.
   * @param key config key
   */
  public getConfig(key: any) {
    return this.config[key];
  }

  /**
   * This method:
   *   1) Load "app.json" to get the configuration object.
   */
  public load(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('loading application config. env', environment);
      this.http.get(environment.contextPath + '/assets/app.json').subscribe(res => {
        console.log('Got application json', res);
        this.config = res;
        resolve(res);
      });
    });
  }
}
