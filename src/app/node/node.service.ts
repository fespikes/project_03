import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

import { TecApiService } from '../shared';

import { NodeFilter } from './node.model';

@Injectable()
export class NodeService {
  private nodeDetails: Subject<any> = new Subject<any>();
  public nodeDetailsObservable = this.nodeDetails.asObservable();
  constructor(private api: TecApiService) { }
  manipulateNodeDetails(node) {
    this.nodeDetails.next(node);
  }

  fetchNodeList(filter?: NodeFilter): Observable<any> {
    return this.api.get(`nodes`, {...filter});
  }

  // deprecated
  fetchNodeSummary(): Observable<any> {
    return this.api.get('nodes/summaries');
  }

  addNodeLabel(label: object, name): Observable<any> {
    return this.api.post(`nodes/${name}/labels`, {...label});
  }

  removeLabel(key, name): Observable<any> {
    return this.api.delete(`nodes/${name}/labels/${key}`);
  }



}
