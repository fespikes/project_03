import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from 'tdc-ui';
import { ServiceFilter, TecApiService } from 'app/shared';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private api: TecApiService,
  ) {}

  getServiceList(filter: ServiceFilter, pagination: Pagination): Observable<any> {
    const params = Object.assign(filter, pagination);
    return this.api.get(`services/data`, params);
  }

  changeSharing(name: string, operation): Observable<any> {
    return this.api.put(`services/data${name}`, {...operation});
  }

  fetchUsingInstances(name: string, pagination: Pagination): Observable<any> {
    console.log(pagination);
    return this.api.get(`......`, {...pagination});
  }
}
