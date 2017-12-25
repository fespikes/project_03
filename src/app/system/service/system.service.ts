import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Pagination } from 'tdc-ui';
import { TecApiService } from '../../shared';
import { Service, ServiceList } from '../model/system-model';

@Injectable()
export class SystemService {

  config = {
    fullResponse: true,
  };

  constructor(
    private api: TecApiService,
  ) { }

  getServiceList(pagiantion: Pagination): Observable<ServiceList> {
    return this.api.get(`services/list`, pagiantion, this.config);
  }

  deleteService() {

  }

  getServiceYamls() {

  }

}
