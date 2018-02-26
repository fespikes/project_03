import { EventEmitter } from 'events';
import { min } from 'lodash-es';

import { Overlay } from '../overlay';
import { CanvasContainer } from '../container';
import { TooltipItem } from './tooltip';

export abstract class TooltipBundleCls {
  x: number;
  title: string;
  items: TooltipItem[];
  abstract distance(x: number, y: number);
  abstract activate();
  abstract deactivate();
}

export class TooltipEvent extends EventEmitter {
  items: TooltipBundleCls[];
  overlay: Overlay;
  canvas: CanvasContainer;
  active: TooltipBundleCls;

  constructor(canvas: CanvasContainer, items: TooltipBundleCls[]) {
    super();
    this.items = items;
    this.canvas = canvas;
    this.setup();
  }

  setup() {
    this.canvas.mouseEvent.on('mousemove', ([x, y]) => {
      this.emit('mousemove', [x, y]);
      const curActive = this.getActive(x);
      if (this.active !== curActive) {
        this.active = curActive;
        this.deactivateAllItems();
        this.active.activate();
        this.emit('axismove', this.active.x);
        this.emit('tooltip', {
          title: this.active.title,
          items: this.active.items,
        });
      }
    });

    this.canvas.mouseEvent.on('mouseenter', (event) => {
      this.emit('mouseenter', event);
    });

    this.canvas.mouseEvent.on('mouseleave', (event) => {
      this.emit('mouseleave', event);
      this.deactivateAllItems();
      this.active = null;
    });
  }

  getActive(x: number): TooltipBundleCls {
    const dists = this.items.map((object) => object.distance(x, null));
    const minDist = min(dists);
    const minIdx = dists.indexOf(minDist);
    return this.items[minIdx];
  }

  deactivateAllItems() {
    this.items.forEach((item) => {
      item.deactivate();
    });
  }
}
