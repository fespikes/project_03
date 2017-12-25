import * as d3 from 'd3';
import { ScaleTime, Axis } from 'd3';

import { SelectionType } from '../chart-base';
import {
  AxisBase,
  AxisPosition,
  AxisTickConfig,
  AxisGridConfig,
  AxisLineStyle,
  AxisTextStyle,
} from './axis-base';

export class TimeAxisConfig {
  tick = new AxisTickConfig();
  grid = new AxisGridConfig();
  lineStyle = new AxisLineStyle();
  textStyle = new AxisTextStyle();
}

export class TimeAxis extends AxisBase {
  scale: ScaleTime<any, any>;
  axis: Axis<any>;

  constructor(
    public config: TimeAxisConfig,
    container: SelectionType,
    position: AxisPosition,
  ) {
    super(container, position, config);
  }

  draw(domain: any[], range: [number, number]) {
    const { tick } = this.config;

    this.scale = d3.scaleTime()
      .domain(d3.extent(domain))
      .rangeRound(range)
      .nice();

    this.axis = this.initAxis(this.position);
    this.axis.ticks(tick.count)
      .tickPadding(tick.padding)
      .tickFormat(d3.timeFormat('%x'));

    this.container.append('g')
      .attr('class', 'time-axis')
      .call(this.axis);

    this.styleLine();
    this.styleText();
  }
}
