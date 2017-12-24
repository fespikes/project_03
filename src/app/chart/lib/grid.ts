import { ScaleLinear, ScaleTime, AxisScale } from 'd3';

import { Container2D } from './helpers/transform-helper';
import { SelectionType } from './chart-base';
import { AxisGridConfig } from './axis/axis-base';

export interface GenericScale {
  (...arg);
  ticks(...arg);
}

export type GridOrientation = 'horizontal' | 'vertical';

export class Grid {
  constructor(
    private container: SelectionType,
    private canvas: Container2D,
  ) {}

  draw(
    config: AxisGridConfig,
    tickCount: number,
    scale: GenericScale,
    orientation: GridOrientation = 'horizontal',
  ) {
    if (!config.style) {
      return;
    }
    const grid = this.container.append('g').attr('class', `grid-${orientation}`);
    let line: SelectionType;
    if (orientation === 'horizontal') {
      line = grid
        .selectAll('g')
        .data(scale.ticks(tickCount))
        .enter()
          .append('line')
            .attr('class', 'grid-horizontal-line')
            .attr('x1', 0)
            .attr('x2', this.canvas.width)
            .attr('y1', (d) => scale(d))
            .attr('y2', (d) => scale(d));
    }

    if (orientation === 'vertical') {
        line = grid
          .selectAll('g')
          .data(scale.ticks(tickCount))
          .enter()
            .append('line')
              .attr('class', 'grid-vertical-line')
              .attr('y1', 0)
              .attr('y2', this.canvas.height)
              .attr('x1', (d) => scale(d))
              .attr('x2', (d) => scale(d));
    }

    if (config.style === 'dash') {
      line.attr('stroke-dasharray', '8, 4');
    }
  }
}
