import { Injectable } from '@angular/core';

import { TuiMessageService  } from 'tdc-ui';
import { TecApiService } from './api.service';

@Injectable()
export class MetaDateService {
  metaKey = 'eco:meta';

  constructor(
    private api: TecApiService,
    private message: TuiMessageService,
  ) {}

  fetMetaData(cb?) {
    this.api.get(`metadatas`).subscribe(res => {
      const str = JSON.stringify(res);
      window.localStorage.setItem(this.metaKey, str);
      if (cb) {
        cb(this.getMetaData());
      }
    });
  }

  getMetaData() {
    const str = window.localStorage.getItem(this.metaKey);
    const obj = JSON.parse(str);
    return obj;
  }

}
