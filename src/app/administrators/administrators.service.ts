import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TecApiService } from '../shared';

import { Filter } from './administrators.model';

@Injectable()
export class AdministratorsService {

  constructor(private api: TecApiService) { }

  fetchAdministrators(filter?: Filter): Observable<any> {
    return this.api.get(`admins`, {...filter});
  }

  addAdministrator(params) {
    return this.api.post(`admins`, {...params});
  }
  deleteAdministrator(id: number) {
    return this.api.delete(`admins/${id}`);
  }

}
