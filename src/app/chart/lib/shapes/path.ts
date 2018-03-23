import * as d3 from 'd3';

import { SelectionType } from '../core';
import { Point2D } from '../helpers/transform-helper';

export type curveStyle = 'curveLinear' | 'curveStep' | 'curveBasis'
  | 'curveCardinal' | 'curveMonotoneX' | 'curveCatmullRom';

export class PathShapeConfig {
  width? = 2;
  color = '#ccc';
  curve?: curveStyle = 'curveMonotoneX';

  static default(config) {
    const _config = new PathShapeConfig();
    return Object.assign(_config, config);
  }
}

export class Path {
  node: SelectionType;
  config: PathShapeConfig;
  points: Point2D[];

  get path() {
    return this.node.select('path');
  }

  get pathMeta() {
    return d3.line<Point2D>()
      .x((p) => p.x)
      .y((p) => p.y)
      .curve(d3[this.config.curve]);
  }

  get xAxisPathMeta() {
    return d3.line<Point2D>()
      .x((p) => p.x)
      .y(0)
      .curve(d3[this.config.curve]);
  }

  static config(config: PathShapeConfig) {
    const line = new Path();
    line.config = PathShapeConfig.default(config);

    return line;
  }

  draw(container: SelectionType, points: Point2D[]) {
    this.node = container.append('g');
    this.points = points;

    this.drawLine();

    return this;
  }

  shadow(enable = true) {
    if (enable) {
      this.setLineShadow();
      this.path.style('filter', 'url(#line-shadow)');
    } else {
      this.path.style('filter', '');
    }

    return this;
  }

  animate(enable = true) {
    const { points } = this;

    if (enable) {
      this.path
      .append('animate')
      .classed('line-animation', true)
      .attr('dur', '1s')
      .attr('attributeName', 'd')
      .attr('calcMode', 'spline')
      .attr('keyTimes', '0; 1')
      .attr('keySplines', '.5 0 .5 1')
      .attr('from', this.xAxisPathMeta(points))
      .attr('to', this.pathMeta(points));
    } else {
      this.path.selectAll('.line-animation').remove();
    }

    return this;
  }

  area(enable = false, params = {canvasHeight: 0, color: 'rgba(227,230,237, 0.5)', animation: false}) {
    const {canvasHeight, color, animation} = params;
    const startArea = d3.area<Point2D>()
    .x((p) => p.x)
    .y0(canvasHeight)
    .y1(0)
    .curve(d3[this.config.curve]);

    const finishArea = d3.area<Point2D>()
    .x((p) => p.x)
    .y0(canvasHeight)
    .y1((p) => p.y)
    .curve(d3[this.config.curve]);

    const { points } = this;

    if (enable) {
      const area = this.node.append('path')
      .attr('class', 'line-area')
      .attr('d', finishArea(points))
      .attr('fill', color);

      if (animation) {
        area
        .append('animate')
        .attr('dur', '1s')
        .attr('attributeName', 'd')
        .attr('calcMode', 'spline')
        .attr('keyTimes', '0; 1')
        .attr('keySplines', '.5 0 .5 1')
        .attr('from', startArea(points))
        .attr('to', finishArea(points));
      }
    } else {
      this.node.selectAll('.line-area').remove();
    }
    return this;
  }

  drawLine() {
    const { color, width, curve } = this.config;
    const { points } = this;

    const line = this.node.append('path')
      .attr('class', 'shape-line')
      .attr('d', this.pathMeta(points))
      .style('stroke', color)
      .style('stroke-width', `${width}px`)
      .style('fill', 'none')
      .style('shape-rendering', 'auto');
  }

  setLineShadow() {
    if (!this.node.selectAll('#line-shadown').size()) {
      const defs = this.node.append('defs');
      const filter = defs.append('filter')
        .attr('id', 'line-shadow')
        .attr('height', '130%');

      filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('color', '#ccc')
        .attr('stdDeviation', 3)
        .attr('result', 'blur');

      filter.append('feOffset')
        .attr('in', 'blur')
        .attr('dx', 3)
        .attr('dy', 5)
        .attr('result', 'offsetBlur');

      filter.append('feComponentTransfer')
        .append('feFuncA')
          .attr('type', 'linear')
          .attr('slope', '0.2');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode');
      feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');
    }
  }
}
