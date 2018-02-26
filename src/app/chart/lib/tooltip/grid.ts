import * as d3 from 'd3';

import { Container } from '../container';
import { AxisGridConfig } from '../axis';
import { SelectionType } from '../chart-base';

export class Grid {
  container: Container;
  xTicks: number[];
  yTicks: number[];
  gridLineX: SelectionType;
  gridLineY: SelectionType;

  constructor(container: Container) {
    this.container = container;
  }

  drawY(ticks: number[], config: AxisGridConfig) {
    this.yTicks = ticks;
    const { width } = this.container.dim;
    this.gridLineY = this.container.selection
    .selectAll('g')
    .data(ticks)
    .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => d)
      .attr('y2', (d) => d);

    this.styleLine(this.gridLineY, config);
  }

  drawX(ticks: number[], config: AxisGridConfig) {
    this.xTicks = ticks;
    const { height } = this.container.dim;
    this.gridLineX = this.container.selection
    .selectAll('g')
    .data(ticks)
    .enter()
      .append('line')
      .attr('x1', (d) => d)
      .attr('x2', (d) => d)
      .attr('y1', 0)
      .attr('y2', height);

    this.styleLine(this.gridLineX, config);
  }

  styleLine(line: SelectionType, config: AxisGridConfig) {
    const { color, strokeWidth, style } = config;
    line.attr('stroke', color);
    line.attr('stroke-width', strokeWidth);
    if (style === 'dash') {
      line.attr('stroke-dasharray', '8, 4');
    }
  }
}
