import * as d3 from 'd3';
import { Axis, ScaleBand } from 'd3';

import { SelectionType } from '../chart-base';
import {
  AxisBase,
  AxisPosition,
  AxisTickConfig,
  AxisGridConfig,
} from './axis-base';

export class BandAxisConfig {
  padding = {
    inner: 0.5,
    outer: 0.2,
  };
}

export class BandAxis extends AxisBase {
  scale: ScaleBand<any>;
  axis: Axis<any>;

  constructor(
    private config: BandAxisConfig,
    container: SelectionType,
    position: AxisPosition,
  ) {
    super(container, position);
  }

  draw(domain: any[], range: [number, number]) {
    const { padding } = this.config;

    this.scale = d3.scaleBand()
      .domain(domain)
      .rangeRound(range)
      .paddingInner(padding.inner)
      .paddingOuter(padding.outer);

    this.axis = this.initAxis(this.position);
    this.container.append('g')
      .attr('class', 'band-axis')
      .call(this.axis);
  }
}
