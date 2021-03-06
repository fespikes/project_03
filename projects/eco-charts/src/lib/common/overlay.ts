import { EventEmitter } from 'events';

import { Rect2D } from './transform-helper';
import { SelectionType } from './chart-base';

export class Overlay extends EventEmitter {
  container: SelectionType;
  container2d: Rect2D;

  constructor(container: SelectionType, container2d: Rect2D) {
    super();
    this.container = container;
    this.container2d = container2d;
    this.setup();
    setTimeout(() => {
      this.startListen();
    });
  }

  clear() {
    this.container.remove();
  }

  setup() {
    const { width, height } = this.container2d;
    this.container
      .style('position', 'relative')
      .style('width', `${width}px`)
      .style('height', `${height}px`);
  }

  startListen() {
    ['mouseenter', 'mousemove', 'mouseleave'].forEach((event) => {
/*       this.container.on(event, () => {
        this.emit(event);
      }); */
    });
  }
}
