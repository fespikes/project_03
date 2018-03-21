import * as d3 from 'd3';
import { Axis, ScaleLinear } from 'd3';

import { SelectionType } from '../chart-base';
import {
  AxisBase,
  AxisPosition,
  AxisTickConfig,
  AxisGridConfig,
  AxisLineStyle,
  AxisTextStyle,
} from './axis-base';
import { AxisContainer } from '../container';

export class LinearAxisConfig {
  tick = new AxisTickConfig();
  grid = new AxisGridConfig();
  lineStyle = new AxisLineStyle();
  textStyle = new AxisTextStyle();
}

export class LinearAxis extends AxisBase {
  scale: ScaleLinear<any, any>;
  axis: Axis<any>;

  static create(config: LinearAxisConfig, container: AxisContainer, domain: any[]) {
    const { selection, placement, range } = container;
    const axis = new LinearAxis(config, selection, placement);
    axis.draw(domain, range);
    return axis;
  }

  constructor(
    public config: LinearAxisConfig,
    container: SelectionType,
    position: AxisPosition,
  ) {
    super(container, position, config);
  }

  draw(domain: any[], range: [number, number]) {
    const { tick } = this.config;

    this.scale = d3.scaleLinear()
      .domain(d3.extent(domain))
      .rangeRound(range)
      .nice();

    this.axis = this.initAxis(this.position);
    this.axis.ticks(tick.count)
      .tickPadding(tick.padding);

    this.container.append('g')
      .attr('class', 'linear-axis')
      .call(this.axis);

    this.styleLine();
    this.styleText();
  }

  ticks() {
    return this.scale.ticks(this.config.tick.count)
      .map((t) => this.scale(t));
  }
}
