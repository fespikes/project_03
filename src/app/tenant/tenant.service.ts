import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TecApiService } from '../shared';
import { Pagination } from 'tdc-ui';
import {
  TenantInfoWrap,
  AllTenants,
  TenantSummary,
  TenantSummaries,
  TenantCount,
  Consumption,
  Instance,
  Errors,
  Quota,
} from './tenant-model';


@Injectable()
export class TenantService {

  constructor(private api: TecApiService) { }

  fetchAllTenants(): Observable<AllTenants> {
    return this.api.get('tenants');
  }

  fetchSummaries(keyword: string): Observable<TenantSummaries> {
    return this.api.get(`tenants/summaries`, {keyword: keyword});
  }

  fetchTenantsCount(): Observable<TenantCount> {
    return this.api.get(`tenants/count`);
  }

  fetchConsumption(period: string): Observable<Consumption[]> {
    return this.api.get(`tenants/consumptions`, {period: period});
  }

  fetchInfo(uid: string): Observable<TenantInfoWrap> {
    return this.api.get(`tenants/${uid}`);
  }

  fetchInstanceInfos(name, filter): Observable<Instance[]> {
    return this.api.get(`tenant/${name}`, filter);
  }

  fetchErrors(name, filter): Observable<Errors> {
    return this.api.get(`tenant/${name}/errors`, filter);
  }

  fetchQuota(name): Observable<Quota> {
    return this.api.get(`tenant/${name}/quota`);
  }

}
