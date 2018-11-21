import { Injectable, EventEmitter } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

import { TecApiService } from 'app/shared';
import { Filter } from './network.model';

@Injectable()
export class NetworkService {
  constructor(private api: TecApiService) { }

  fetchList(filter?: Filter): Observable<any> {
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    return this.api.get(`networks`, {...filter, tenantUid: uid});
  }

  fetchEnums(): Observable<any> {
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    return this.api.get(`networks/options`);
  }

  getNetworkSecurityRules(name, filter): Observable<any> {
    return this.api.get(`networks/${name}/securityRules`, {...filter});
  }

  addSecurityRule(name, params): Observable<any> {
    return this.api.post(`networks/${name}/securityRules`, {...params});
  }

  removeSecurityRule(name, params): Observable<any> {
    return this.api.post(`networks/${name}/securityRules/deletions`, {...params});
  }

}
