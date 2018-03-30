import { Component, Injectable } from '@angular/core';

import { Pagination } from 'tdc-ui';
import { ServiceFilter, TecApiService } from 'app/shared';

@Injectable()
export class SystemModuleService {
  constructor(
    private api: TecApiService,
  ) {
  }

  getServiceList(filter: ServiceFilter, pagination: Pagination) {
    const params = Object.assign(filter, pagination);
    return this.api.get(`services`, params);
  }
}


