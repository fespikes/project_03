import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TecApiService } from '../shared';

import { NodeFilter } from './node.model';


@Injectable()
export class NodeService {

  constructor(private api: TecApiService) { }

  fetchNodeList(filter?: NodeFilter): Observable<any> {
    return this.api.get(`nodes`, {...filter});
  }

  fetchNodeSummary(): Observable<any> {
    return this.api.get('nodes/summaries');
  }

}
