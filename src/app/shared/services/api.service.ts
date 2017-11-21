import * as path from 'path';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { PartialCollection } from '../models';

@Injectable()
export class TecApiService {
  constructor(private http: Http) { }

  private get headers(): Headers {
    return new Headers({
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
    });
  }

  private formatErrors(error: any) {
    let data;
    try {
      data = error.json();
    } catch (err) {
      data = { error: 'fail to parse' };
    }
    return Observable.throw(data);
  }

  makeUrl(url) {
    return path.join(environment.apiUrl, url);
  }

  get(path: string, params: Object = {}): Observable<any> {
    return this.http.get(this.makeUrl(path), { headers: this.headers, search: params })
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  getAll(path: string, params: Object = {}): Observable<PartialCollection> {
    params['size'] = Math.pow(2, 31) - 1;
    params['page'] = 1;
    return this.get(path, params);
  }

  getText(path: string, params: Object = {}): Observable<any> {
    return this.http.get(this.makeUrl(path), { headers: this.headers, search: params })
      .catch(this.formatErrors)
      .map((res: Response) => res.text());
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      this.makeUrl(path),
      JSON.stringify(body),
      { headers: this.headers },
    )
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      this.makeUrl(path),
      JSON.stringify(body),
      { headers: this.headers },
    )
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  postRaw(path: string, body: Object = {}, config: Object = {}): Observable<any> {
    return this.http.post(
      this.makeUrl(path),
      body,
      config,
    )
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  delete(path): Observable<any> {
    return this.http.delete(
      this.makeUrl(path),
      { headers: this.headers },
    )
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }
}
