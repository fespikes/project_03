import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TecApiService } from '../shared';
import { Pagination } from 'tdc-ui';
import {
  TenantInfo,
  TenantSummary,
  TenantSummaries,
  TenantCount,
  Consumption,
  InstanceInfo,
  Errors,
  Quota,
  Bills,
  OperationResult,
} from './tenant-model';


@Injectable()
export class TenantService {

  constructor(private api: TecApiService) { }

  fetchAllTenants(): Observable<TenantInfo[]> {
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

  fetchInfo(uid: string): Observable<TenantInfo> {
    sessionStorage.setItem('eco:tenant:detail:uid', uid);
    return this.api.get(`tenants/${uid}`);
  }

  fetchInstanceInfos(uid, pagination, filter): Observable<InstanceInfo> {
    const { page, size } = pagination;
    const params = {
      page: page,
      size: size,
      ...filter,
    };
    return this.api.get(`tenants/${uid}/instances`, params);
  }

  fetchErrors(name, filter): Observable<Errors> {
    return this.api.get(`tenant/${name}/errors`, filter);
  }

  fetchQuota(name): Observable<Quota> {
    return this.api.get(`tenant/${name}/quota`);
  }

  fetchBills(uid, pagination, keyword): Observable<Bills> {
    const { page, size } = pagination;
    const params = {
      page: page,
      size: size,
      keyword: keyword,
    };
    return this.api.get(`tenants/${uid}/bills`, params);
  }

  clearBill(id): Observable<OperationResult> {
    return this.api.put(`bills/${id}`);
  }

  correctBill(id, corrections): Observable<OperationResult> {
    return this.api.post(`bills/${id}/corrections`, corrections);
  }

}
