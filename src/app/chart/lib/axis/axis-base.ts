import * as d3 from 'd3';
import { SelectionType } from '../chart-base';

export type AxisPosition = 'top' | 'right' | 'bottom' | 'left';

export type GridStyle = 'solid' | 'dash';

export class AxisTickConfig {
  count: number;
  padding = 10;
}

export class AxisGridConfig {
  style: GridStyle;
}

export abstract class AxisBase {
  abstract scale;

  constructor(
    public container: SelectionType,
    public position: AxisPosition,
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
}
