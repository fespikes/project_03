import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TecApiService } from '../shared';


@Injectable()
export class AbstractService {

  config = {
    fullResponse: true,
  };

  constructor(
    private api: TecApiService,
  ) { }

  getQuantitySummary(): Observable<any> {
    return this.api.get(`platforms/count/summaries`, this.config);
  }

  getLoadSummary(): Observable<any> {
    return this.api.get(`platforms/loads/summaries`, this.config);
  }

}
