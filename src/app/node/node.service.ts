import { Injectable, EventEmitter } from '@angular/core';

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

  fetchNodeList() {
  	return this.api.get(`nodes`);
  }

  fetchNodeSummary() {
  	return this.api.get('nodes/summaries');
  }

}
