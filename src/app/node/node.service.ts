import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TecApiService } from '../shared';

@Injectable()
export class NodeService {

  constructor(private api: TecApiService) { }

  onToggle = new EventEmitter();

  notifyToggle() {
    // 在菜单变化稳定之后发出事件
    setTimeout(() => {
      this.onToggle.emit();
    });
  }

  fetchNodeList(filter?): Observable<any> {
  	return this.api.get(`nodes`, {...filter});
  }

  fetchNodeSummary(): Observable<any> {
  	return this.api.get('nodes/summaries');
  }

}
