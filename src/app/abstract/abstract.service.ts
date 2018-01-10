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

  getLoadSummary(callback) {
    this.api.get(`platforms/loads/summaries`, this.config).subscribe(response => {
      callback(this.adaptLoadSummary(response));
    });
  }

  adaptLoadSummary(quantitySummary) {
    const obj = {...quantitySummary};
    const result = [];

    delete obj.startTime;
    delete obj.endTime;

    Object.keys(obj).forEach(key => {

      const parts = [];
      const columns = [];

      obj[key].forEach(part => {
        parts.push(part.value);
        columns.push(part.title);
      });

      result.push({
        state: key,
        columns: columns,
        parts: parts,
      });

    });
    return {
      donuts: result,
    };
  }

}
