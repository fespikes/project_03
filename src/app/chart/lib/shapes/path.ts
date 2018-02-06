import * as d3 from 'd3';
import {SelectionType} from '../chart-base';

class PathPointCoord {
  x: number;
  y: number;
}

export class PathShapeConfig {
  points: PathPointCoord[];
  width: number;
  color: string;
  curve: string;
}

export class Path {
  config: PathShapeConfig;

  static config(config: PathShapeConfig) {
    const path = new Path();
    path.config = config;

    return path;
  }

  draw(container: SelectionType) {
    const { color, width, curve, points } = this.config;
    const line = d3.line<PathPointCoord>()
      .x(p => p.x)
      .y(p => p.y)
      .curve(d3[curve]);

    container.append('path')
      .attr('class', 'shape-line')
      .attr('d', line(points))
      .style('stroke', color)
      .style('stroke-width', `${width}px`)
      .style('shape-rendering', 'auto');
  }
}
