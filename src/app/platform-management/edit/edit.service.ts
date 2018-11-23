import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Pagination } from 'tdc-ui';
import { ServiceFilter, TecApiService } from 'app/shared';

@Injectable()
export class EditService {
  constructor(
    private api: TecApiService,
  ) {}

  // get system service quotas, updata both quotas
  servicesQuotas(method = 'get', updatedQuotas?): Observable<any> {
    const params = updatedQuotas ? [...updatedQuotas] : {};
    return this.api[method](`services/quotas`, params);
  }

  // get only data service quotas
  dataQuotas(method = 'get'): Observable<any> {
    return this.api[method](`services/data/quotas`);
  }

}


