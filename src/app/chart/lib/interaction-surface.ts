import * as d3 from 'd3';
import { min } from 'lodash-es';
import { EventEmitter } from 'events';

import { SelectionType } from './chart-base';
import { Point2D } from './helpers/transform-helper';

export type InteractionType = 'radiated' | 'covered' | 'normal';

export abstract class InteractionObject {
  abstract distance(x: number, y: number);
  // abstract onInteract(type: InteractionType);
  abstract activate();
  abstract deactivate();
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
    console.log('onMouseLeave');
    this.setActive();
  }

  setActive(object?: InteractionObject) {
    if (!object) {
      this.deactivateAll();
      this.active = null;
      this.emit('inactive');
    } else if (object !== this.active) {
      this.deactivateAll();
      object.activate();
      this.active = object;
      this.emit('activeChange', object);
    }
  }

  emitMouseCoord() {
    this.emit('mouseCoordChange', this.mouseCoord);
  }

  deactivateAll() {
    this.objects.forEach((object) => object.deactivate());
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
