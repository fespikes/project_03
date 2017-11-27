import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TecApiService } from '../shared';
import { Pagination } from 'tdc-ui';
import {
  TenantInfo,
  TenantSummary,
  Instance,
  Errors,
  Quota,
} from './tenant-model';


@Injectable()
export class TenantService {

  constructor(private api: TecApiService) { }

  fetchSummaries(keyword: string): Observable<TenantSummary[]> {
    return this.api.get(`tenants/summaries`, {keyword: keyword});
  }

  fetchInfo(name: string): Observable<TenantInfo> {
    return this.api.get(`tenants/${name}/info`);
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
