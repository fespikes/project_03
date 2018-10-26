import * as path from 'path-browserify';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
import { catchError } from 'rxjs/operators';

import { TuiMessageService  } from 'tdc-ui';
import { PartialCollection } from '../models';

@Injectable()
export class TecApiService {
  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
    });
  }
  private get httpOptions(): any {
    return {
      headers: this.headers,
    };
  }
  constructor(
    private http: HttpClient,
    private message: TuiMessageService,
  ) {
    this.formatErrors = this.formatErrors.bind(this);
  }

  // no abstract url path, for logout only
  getInRoot(url: string, params: Object = {}): Observable<any> {
    const queryParams = this.setQueryParams(params, true);
    return this.http.get(url, queryParams)
      .pipe(
        catchError(this.formatErrors),
      );
  }

  // normal get ,for response format(depends on project apis)
  get(url: string, params: Object = {}): Observable<any> {
    const queryParams = this.setQueryParams(params);
    return this.http.get(this.makeUrl(url), queryParams)
      .pipe(
        catchError(this.formatErrors),
      ).map(res => this.dataAdjustment(res));
  }

  getUnformat(url: string, params: Object = {}): Observable<any> {
    const queryParams = this.setQueryParams(params);
    return this.http.get(this.makeUrl(url), queryParams)
      .pipe(
        catchError(this.formatErrors),
      );
  }

  getAll(url: string, params: Object = {}): Observable<PartialCollection> {
    params['size'] = Math.pow(2, 31) - 1;
    params['page'] = 1;
    return this.get(url, this.setQueryParams(params, true));
  }

  getFile(thePath: string, params: Object = {}): Observable<any> {

    return this.http.get(
        this.makeUrl(thePath),
        { headers: this.headers,
          params: this.setQueryParams(params).params,
          responseType: 'arraybuffer',
          observe: 'response',
        },
      )
        .pipe(catchError(this.formatErrors));
  }

  put(url: string, body: Object = {}): Observable<any> {
    return this.http.put(
      this.makeUrl(url),
      JSON.stringify(body),
      this.httpOptions,
    )
    .pipe(catchError(this.formatErrors));
  }

  post(url: string, body: Object = {}): Observable<any> {
    return this.http.post(
      this.makeUrl(url),
      JSON.stringify(body),
      this.httpOptions,
    )
    .pipe(catchError(this.formatErrors));
  }

  delete(url): Observable<any> {
    return this.http.delete(
      this.makeUrl(url),
      this.httpOptions,
    )
    .pipe(catchError(this.formatErrors));
  }

  // for object only
  setQueryParams(p, all?: boolean) {
    const obj: any = {
      params: new HttpParams(),
      headers: this.headers,
    };
    if (p) {
      Object.keys(p).map((key) => {
        if (!!p[key] || typeof p[key] !== 'undefined') {
          const element = p[key];
          obj.params = obj.params.set(key, element);
        }
      });
    }
    if (!!all) {
      obj.observe = 'response';
    }
    return obj;
  }

  dataAdjustment(res) {
    return res.data;
  }
  private formatErrors(error: any) {
    // const message = error.error instanceof ErrorEvent ?
    const message = error.error.message ?
      error.error.message : `server returned code ${error.status} with body "${error.error}"`;

    this.message.error(message);
    return throwError(error);
  }
  makeUrl(url) {
    return this.join(environment.apiUrl, url);
  }
  join(...parts) {
    const separator = '/';
    const replace   = new RegExp(separator + '{1,}', 'g');
    return parts.join(separator).replace(replace, separator);
  }
}
