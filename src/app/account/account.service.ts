import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { TecApiService } from '../shared';

@Injectable()
export class AccountService {

  constructor(
    private api: TecApiService,
  ) { }

  changePWD(params) {
    return this.api.post(`admins/resetPassword`, {...params});
  }

  fetchLicenseDetails() {
    return this.api.get(`licenses`);
  }

  uploadFile(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.uploadSingle(`licenses/${type}`, formData);
  }

  uploadLicenses(param?): Observable<any> {
    return this.api.put(`licenses`, [...param]);
  }

}
