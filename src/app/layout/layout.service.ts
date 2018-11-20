import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TecApiService, MetaDateService } from '../shared';

@Injectable()
export class LayoutService {

  constructor(
    private api: TecApiService,
    public metaDataService: MetaDateService
  ) { }

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
