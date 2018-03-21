import * as d3 from 'd3';
import { ScaleTime, Axis } from 'd3';

import { SelectionType } from '../chart-base';
import {
  AxisBase,
  AxisPosition,
  AxisTimeTickConfig,
  AxisGridConfig,
  AxisLineStyle,
  AxisTextStyle,
} from './axis-base';
import { AxisContainer } from '../container';

export class TimeAxisConfig {
  tick = new AxisTimeTickConfig();
  grid = new AxisGridConfig();
  lineStyle = new AxisLineStyle();
  textStyle = new AxisTextStyle();
}

export class TimeAxis extends AxisBase {
  scale: ScaleTime<any, any>;
  axis: Axis<any>;

  static create(config: TimeAxisConfig, container: AxisContainer, domain: any[]) {
    const { selection, placement, range } = container;
    const axis = new TimeAxis(config, selection, placement);
    axis.draw(domain, range);
    return axis;
  }

  constructor(
    public config: TimeAxisConfig,
    container: SelectionType,
    position: AxisPosition,
  ) {
    super(container, position, config);
  }

  draw(domain: any[], range: [number, number]) {
    const { tick } = this.config;
    const count = tick.useTimeInterval ? d3[tick.timeInterval].every(tick.interval) : tick.count;

    this.scale = d3.scaleTime()
      .domain(d3.extent(domain))
      .rangeRound(range)
      .nice();

    this.axis = this.initAxis(this.position);
    this.axis.ticks(count)
      .tickPadding(tick.padding)
      .tickFormat(d3.timeFormat(tick.timeFormat));

    this.container.append('g')
      .attr('class', 'time-axis')
      .call(this.axis);

    this.styleLine();
    this.styleText();
  }

  // Override
  format(datum: Date) {
    const timeFormat = d3.timeFormat(this.config.tick.timeFormat);
    return timeFormat(datum);
  }

  ticks() {
    return this.scale.ticks(this.config.tick.count)
      .map((t) => this.scale(t));
  }
}
