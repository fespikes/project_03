import * as d3 from 'd3';
import { SelectionType } from '../chart-base';
import { Point2D } from '../helpers/transform-helper';

export class CircleShapeBorder {
  width: number;
  color: string;
}

export  class CircleShapeConfig {
  center: Point2D;
  radius: number;
  fill = 'white';
  border: CircleShapeBorder = {
    width: 0,
    color: 'none',
  };

  static create(config: any) {
    const _config = new CircleShapeConfig();
    Object.assign(_config, config);
    return _config;
  }
}

export class Circle {
  node: SelectionType;
  center: Point2D;
  radius: number;
  fill: string;
  border: CircleShapeBorder;

  get circle() {
    return this.node.select('circle');
  }

  static config(config: CircleShapeConfig) {
    const circle = new Circle();
    const { center, radius, fill, border } = config;
    Object.assign(circle, { center, radius, fill, border });

    return circle;
  }

  draw(container: SelectionType) {
    const { center: {x, y}, radius, fill, border } = this;
    this.node = container.append('g');
    this.node
    .append('circle')
    .classed('circle-shape', true)
    .attr('fill', fill)
    .attr('r', radius)
    .attr('stroke-width', border.width)
    .attr('stroke', border.color)
    .attr('transform', `translate(${x}, ${y})`)
    .style('transition', 'r 200ms');
  }

  enlarge(r: number) {
    this.circle.attr('r', r);
  }
}
