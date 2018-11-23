import { Injectable, EventEmitter } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

import { TecApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AddService {

  constructor(private api: TecApiService) { }

  fetchEnums(): Observable<any> {
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    return this.api.get(`networks/options`);
  }

  addSecurityRule(name, params): Observable<any> {
    return this.api.post(`networks/${name}/securityRules`, {...params});
  }
}
