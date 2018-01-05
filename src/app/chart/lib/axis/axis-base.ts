import * as d3 from 'd3';
import { SelectionType } from '../chart-base';

export type AxisPosition = 'top' | 'right' | 'bottom' | 'left';

export type GridStyle = 'solid' | 'dash';

export type TimeInterval = 'timeSecond' | 'timeMinute' | 'timeHour' | 'timeDay' | 'timeMonth';

export class AxisTickConfig {
  count: number;
  padding = 10;
}

export class AxisTimeTickConfig implements AxisTickConfig {
  useTimeInterval = false;
  count: number;
  timeInterval: TimeInterval = 'timeMinute';
  interval = 10;
  padding = 10;
  timeFormat = '%x';

  // timeFormat examples and interval examples
  // https://github.com/xswei/d3js_doc/tree/master/API/d3-scale-master#time_domain
}

export class AxisGridConfig {
  style: GridStyle = 'solid';
  color = '#f0f3f7';
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
  abstract scale;

  constructor(
    public container: SelectionType,
    public position: AxisPosition,
    public config: AxisConfigBase,
  ) {
  }

  initAxis(position: AxisPosition) {
    switch (position) {
      case 'top':
        return d3.axisTop(this.scale);
      case 'right':
        return d3.axisRight(this.scale);
      case 'bottom':
        return d3.axisBottom(this.scale);
      case 'left':
        return d3.axisLeft(this.scale);
    }
  }

  styleLine() {
    this.container.selectAll('path, line')
      .attr('stroke', this.config.lineStyle.color)
      .attr('stroke-width', this.config.lineStyle.strokeWidth);
  }

  styleText() {
    this.container.selectAll('text')
      .attr('fill', this.config.textStyle.color)
      .attr('font-size', this.config.textStyle.foneSize);
  }
}
