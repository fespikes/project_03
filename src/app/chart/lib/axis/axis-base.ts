import * as d3 from 'd3';
import { SelectionType } from '../core';
import { AxisScale } from 'd3';
import { Domain } from 'domain';

export type AxisPosition = 'top' | 'right' | 'bottom' | 'left';

export type GridStyle = 'solid' | 'dash';

export type TimeInterval = 'timeSecond' | 'timeMinute' | 'timeHour' | 'timeDay' | 'timeMonth';

export class AxisTickConfig {
  count?: number;
  padding = 5;
}

export class AxisTimeTickConfig extends AxisTickConfig {
  timeInterval?: TimeInterval;
  interval?: number;
  timeFormat = '%x';

  // timeFormat examples and interval examples
  // https://github.com/xswei/d3js_doc/tree/master/API/d3-scale-master#time_domain
}

export class AxisLinearTickConfig extends AxisTickConfig {
  // https://github.com/d3/d3/wiki/%E6%A0%BC%E5%BC%8F%E5%8C%96
  format?: string;
}

export class AxisGridConfig {
  style: GridStyle = 'dash';
  color = 'rgba(240,243,247, .5)';
  strokeWidth = 1;
}

export class AxisLineStyle {
  color = '#f0f3f7';
  strokeWidth = 1;
}

export class AxisTextStyle {
  color = '#c2c9d5';
  foneSize = 12;
}

export class AxisConfigBase {
  textStyle = new AxisTextStyle();
  lineStyle = new AxisLineStyle();
}

export abstract class AxisBase {
  abstract scale: any;

  constructor(
    public selection: SelectionType,
    public position: AxisPosition,
    public config: AxisConfigBase,
  ) {
  }

  initAxis(position: AxisPosition) {
    switch (position) {
      case 'top':
        return d3.axisTop(this.scale);
      case 'right':
        return d3.axisRight(this.invertScale());
      case 'bottom':
        return d3.axisBottom(this.scale);
      case 'left':
        return d3.axisLeft(this.invertScale());
    }
  }

  invertScale() {
    const scale = this.scale.copy();
    const range = scale.range();
    range.sort().reverse();
    scale.rangeRound(range);
    return scale;
  }

  styleLine() {
    this.selection.selectAll('path, line')
      .attr('stroke', this.config.lineStyle.color)
      .attr('stroke-width', this.config.lineStyle.strokeWidth);
  }

  styleText() {
    this.selection.selectAll('text')
      .attr('fill', this.config.textStyle.color)
      .attr('font-size', this.config.textStyle.foneSize);
  }

  format(datum) {
    return datum;
  }
}
