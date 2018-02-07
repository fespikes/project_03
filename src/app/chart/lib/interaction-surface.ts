import * as d3 from 'd3';
import { min } from 'lodash-es';
import { EventEmitter } from 'events';

import { SelectionType } from './chart-base';
import { Point2D } from './helpers/transform-helper';
import { Tooltip } from './tooltip';
import { Overlay } from './overlay';
import { AxisLine } from './axis-line';

export type InteractionType = 'radiated' | 'covered' | 'normal';

export abstract class InteractionObject {
  abstract distance(x: number, y: number);
}

export type DetectionAxis = 'x' | 'y' | 'both';

export class InteractionSurface extends EventEmitter {
  axis: DetectionAxis;
  container: SelectionType;
  objects: InteractionObject[] = [];
  active: InteractionObject;

  get mouseCoord() {
    return d3.mouse(this.container.node());
  }

  config(axis: DetectionAxis, multi: boolean) {
    this.axis = axis;
    return this;
  }

  watch(container: SelectionType) {
    this.container = container;
    this.container.on('mouseenter', this.onMouseMove.bind(this));
    this.container.on('mousemove', this.onMouseMove.bind(this));
    this.container.on('mouseleave', this.onMouseLeave.bind(this));
    return this;
  }

  setObjects(objects: InteractionObject[]) {
    this.objects = objects;
    return this;
  }

  onMouseMove() {
    const object = this.getClosestObject();
    this.setActive(object);
    this.emitMouseCoord();
  }

  onMouseLeave() {
    this.setActive();
  }

  setActive(object?: InteractionObject) {
    if (!object) {
      this.active = null;
      this.emit('inactive');
    } else if (object !== this.active) {
      this.active = object;
      this.emit('activeChange', object);
    }
  }

  emitMouseCoord() {
    this.emit('mouseCoordChange', this.mouseCoord);
  }

  getClosestObject() {
    const dists = this.objects.map((object) => this.getObjectDist(object));
    const minDist = min(dists);
    const minIdx = dists.indexOf(minDist);
    return this.objects[minIdx];
  }

  getObjectDist(object: InteractionObject) {
    const [mouseX, mouseY] = this.mouseCoord;
    return object.distance(mouseX, null);
  }
}

export class TooltipItem {
  name: string;
  value: string;
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
  surface: InteractionSurface;

  constructor(overlay: Overlay, surface: InteractionSurface, items: TooltipInteractionItem[]) {
    this.overlay = overlay;
    this.surface = surface;
    this.items = items;

    this.surface.watch(this.overlay.container)
    .setObjects(this.items)
    .on('activeChange', (active) => {
      this.deactivateAllItems();
      active.activate();
    })
    .on('inactive', (active) => {
      this.deactivateAllItems();
    });

    return this;
  }

  bindTooltip(tooltip: Tooltip) {
    this.surface
    .on('activeChange', (active: TooltipInteractionItem) => {
      tooltip.show();
      tooltip.setContent(active.title, active.items);
    })
    .on('inactive', () => {
      tooltip.hide();
    })
    .on('mouseCoordChange', (mouseCoord) => {
      const [x, y] = mouseCoord;
      tooltip.setPosition(x, y);
    });

    return this;
  }

  bindAxisLine(axisLine: AxisLine) {
    this.surface
    .on('activeChange', (active: TooltipInteractionItem) => {
      axisLine.show();
      axisLine.move(active.x);
    })
    .on('inactive', () => {
      axisLine.hide();
    });

    return this;
  }

  deactivateAllItems() {
    this.items.forEach((item) => {
      item.deactivate();
    });
  }
}
