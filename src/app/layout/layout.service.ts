import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TecApiService } from '../shared';

@Injectable()
export class LayoutService {

  constructor(private api: TecApiService) { }

  getProfile(): Observable<any> {
    return this.api.get(`admins/current`);
  }

  ssoLogout(): void {
    window.location.href = '/sso-logout';
  }

  getEntrances(): Observable<any> {
    return this.api.get(`entrances`);
  }

}
