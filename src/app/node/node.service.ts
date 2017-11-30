import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class NodeService {

  constructor() { }

  onToggle = new EventEmitter();

  notifyToggle() {
    // 在菜单变化稳定之后发出事件
    setTimeout(() => {
      this.onToggle.emit();
    });
  }

}
