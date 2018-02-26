import * as d3 from 'd3';

import { SelectionType } from '../chart-base';
import { Point2D, Vector2D } from '../helpers/transform-helper';
import { Movable } from './movable';

export class RectShapeConfig {
  width: number;
  color? = '#ccc';

  static default(config: RectShapeConfig) {
    const _config = new RectShapeConfig();
    Object.assign(_config, config);
    return _config;
  }
}

export class Rect extends Movable {
  selection: SelectionType;
  shape: SelectionType;
  config: RectShapeConfig;
  base: Point2D;
  height: number;

  constructor(selection: SelectionType, config: RectShapeConfig) {
    super();
    this.selection = selection;
    this.config = RectShapeConfig.default(config);
  }

  draw(base: Point2D, height: number) {
    this.clear();
    this.base = base;

    const { width, color } = this.config;
    this.selection.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', color)
    .attr('x', base.x)
    .attr('y', base.y);
  }

  clear() {
    if (this.shape) {
      this.shape.remove();
      this.shape = null;
    }
  }
}
