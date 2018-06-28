import * as d3 from 'd3';
import { ScaleTime, Axis } from 'd3';

import max from 'lodash-es/max';
import min from 'lodash-es/min';

import { SelectionType, AxisContainer } from '../core';
import {
  AxisBase,
  AxisPosition,
  AxisTimeTickConfig,
  AxisGridConfig,
  AxisLineStyle,
  AxisTextStyle,
} from './axis-base';

export class TimeAxisConfig {
  tick = new AxisTimeTickConfig();
  grid: AxisGridConfig | false = new AxisGridConfig();
  lineStyle = new AxisLineStyle();
  textStyle = new AxisTextStyle();
}

export class TimeAxis extends AxisBase {
  scale: ScaleTime<any, any>;
  axis: Axis<any>;
  count: number;

  static create(config: TimeAxisConfig, container: AxisContainer, domain: any[]) {
    const { selection, placement, range } = container;
    const axis = new TimeAxis(config, selection, placement);
    axis.draw(domain, range);
    return axis;
  }

  constructor(
    public config: TimeAxisConfig,
    selection: SelectionType,
    position: AxisPosition,
  ) {
    super(selection, position, config);
  }

  draw(domain: any[], range: [number, number]) {
    const { tick } = this.config;
    this.count = tick.count;
    if (!tick.count && tick.timeInterval) {
      const startDate = min(domain);
      const endDate = max(domain);
      this.count = d3[tick.timeInterval].every(tick.interval).range(startDate, endDate).length;
    }

    this.scale = d3.scaleTime()
      .domain(d3.extent(domain))
      .rangeRound(range);

    this.axis = this.initAxis(this.position);
    this.axis.ticks(this.count)
      .tickPadding(tick.padding)
      .tickFormat(d3.timeFormat(tick.timeFormat));

    this.selection.append('g')
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
    return this.scale.ticks(this.count)
      .map((t) => this.scale(t));
  }
}
