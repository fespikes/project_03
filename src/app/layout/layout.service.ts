import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TecApiService } from '../shared';

@Injectable()
export class LayoutService {

  constructor(private api: TecApiService) { }

  getProfile(): Observable<any> {
    return this.api.get(`admins/current`);
  }

  ssoLogout(): Observable<any> {
    return this.api.getInRoot(`sso-logout`);
  }

}