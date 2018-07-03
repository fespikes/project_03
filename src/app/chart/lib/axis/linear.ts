import * as d3 from 'd3';
import { Axis, ScaleLinear } from 'd3';
import min from 'lodash-es/min';
import max from 'lodash-es/max';

import { AxisContainer, SelectionType } from '../core';
import {
  AxisBase,
  AxisPosition,
  AxisLinearTickConfig,
  AxisGridConfig,
  AxisLineStyle,
  AxisTextStyle,
} from './axis-base';

export class LinearAxisConfig {
  tick = new AxisLinearTickConfig();
  grid: AxisGridConfig | false = new AxisGridConfig();
  lineStyle = new AxisLineStyle();
  textStyle = new AxisTextStyle();
  name: string;

  constructor(tickCount?: number) {
    if (tickCount >= 0) {
      this.tick.count = tickCount;
    }
  }
}

export class LinearAxis extends AxisBase {
  scale: ScaleLinear<any, any>;
  axis: Axis<any>;
  count: number;

  static create(config: LinearAxisConfig, container: AxisContainer, domain: any[]) {
    const { selection, placement, range } = container;
    const axis = new LinearAxis(config, selection, placement);
    axis.draw(domain, range);
    return axis;
  }

  constructor(
    public config: LinearAxisConfig,
    selection: SelectionType,
    position: AxisPosition,
  ) {
    super(selection, position, config);
  }

  draw(domain: any[], range: [number, number]) {
    const { tick } = this.config;

    this.scale = d3.scaleLinear()
      .domain(d3.extent(domain))
      .rangeRound(range)
      .nice();

    this.count = tick.count;
    // 防止整形坐标轴出现大于domain范围的tick数量 -> 导致坐标刻度重复
    if (tick.format === 'd') {
      const dist = max(domain) - min(domain);
      if (dist < 5) {
        this.count = dist;
      }
    }

    this.axis = this.initAxis(this.position);
    this.axis.ticks(this.count)
      .tickPadding(tick.padding);
    if (tick.format) {
      this.axis.tickFormat(d3.format(tick.format));
    }

    this.selection.append('g')
      .attr('class', 'linear-axis')
      .call(this.axis);

    if (this.config.name) {
      const textNode = this.selection.append('text')
        .text(this.config.name);
      // 水平垂直平移1/2长度
      const {width, height} = (textNode.node() as any).getBoundingClientRect();
      textNode.attr('transform', `translate(-${width / 2}, -${height / 2})`);
    }

    this.styleLine();
    this.styleText();
  }

  ticks() {
    return this.scale.ticks(this.count)
      .map((t) => this.scale(t));
  }
}
