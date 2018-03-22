import * as d3 from 'd3';

import { SelectionType } from '../chart-base';
import { Point2D, Vector2D } from '../helpers/transform-helper';

export class LineShapeConfig {
  width? = 1;
  color? = '#ccc';

  static default(config: LineShapeConfig) {
    const _config = new LineShapeConfig();
    Object.assign(_config, config);
    return _config;
  }
}

export class Line {
  selection: SelectionType;
  shape: SelectionType;
  config: LineShapeConfig;
  from: Point2D;
  to: Point2D;

  constructor(selection: SelectionType, config: LineShapeConfig) {
    this.selection = selection;
    this.config = LineShapeConfig.default(config);
  }

  draw(from: Point2D, to: Point2D) {
    this.clear();
    this.from = from;
    this.to = to;

    const { width, color } = this.config;
    this.shape = this.selection.append('line')
    .attr('stroke', color)
    .attr('stroke-width', width)
    .attr('x1', from.x)
    .attr('y1', from.y)
    .attr('x2', to.x)
    .attr('y2', to.y);
  }

  clear() {
    if (this.shape) {
      this.shape.remove();
      this.shape = null;
    }
  }
}
