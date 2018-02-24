import * as d3 from 'd3';
import { min } from 'lodash-es';
import { EventEmitter } from 'events';

import { SelectionType, InteractiveContainer } from './chart-base';
import { Point2D } from './helpers/transform-helper';
import { Tooltip } from './tooltip';
import { Overlay } from './overlay';
import { AxisLine } from './axis-line';

export class TooltipItem {
  name: string;
  value: number;
  color: string;
}

export abstract class TooltipInteractionItem {
  x: number;
  title: string;
  items: TooltipItem[];
  abstract distance(x: number, y: number);
  abstract activate();
  abstract deactivate();
}

export class TooltipInteraction {
  items: TooltipInteractionItem[];
  overlay: Overlay;
  canvas: InteractiveContainer;

  constructor(canvas: InteractiveContainer, items: TooltipInteractionItem[]) {
    this.items = items;
    this.canvas = canvas;
    this.canvas.mouseEvent.on('mousemove', ([x, y]) => {
      const active = this.getActive(x);
      this.deactivateAllItems();
      active.activate();
    });

    this.canvas.mouseEvent.on('mouseleave', () => {
      this.deactivateAllItems();
    });

    return this;
  }

  bindTooltip(tooltip: Tooltip) {
    this.canvas.mouseEvent.on('mousemove', ([x, y]) => {
      const active = this.getActive(x);
      tooltip.show();
      tooltip.setContent(active.title, active.items);
      tooltip.setPosition(x + 60, y + 60);
    });

    this.canvas.mouseEvent.on('mouseleave', () => {
      tooltip.hide();
    });

    return this;
  }

  bindAxisLine(axisLine: AxisLine) {
    this.canvas.mouseEvent.on('mousemove', ([x, y]) => {
      const active = this.getActive(x);
      axisLine.show();
      axisLine.move(active.x);
    });

    this.canvas.mouseEvent.on('mouseleave', () => {
      axisLine.hide();
    });

    return this;
  }

  getActive(x: number): TooltipInteractionItem {
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
