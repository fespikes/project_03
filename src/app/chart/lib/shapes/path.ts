import * as d3 from 'd3';
import max from 'lodash-es/max';

import { SelectionType } from '../core';
import { Point2D } from '../helpers/transform-helper';

export type curveStyle = 'curveLinear' | 'curveStep' | 'curveBasis'
  | 'curveCardinal' | 'curveMonotoneX' | 'curveCatmullRom';

export class PathShapeConfig {
  width ? = 2;
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
    if (enable) {
      const totalLength = (this.path.node() as any).getTotalLength();
      this.path.transition().duration(1000)
      .attrTween('stroke-dasharray', () => {
        const i = d3.interpolateString(`0,${totalLength}`, `${totalLength},${totalLength}`);
        return function (t) { return i(t); };
      });
    }

    return this;
  }

  drawLine() {
    const { color, width, curve } = this.config;
    const { points } = this;

    this.node.append('path')
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
