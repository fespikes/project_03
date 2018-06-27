import * as d3 from 'd3';
import { Axis, ScaleBand } from 'd3';

import { SelectionType, AxisContainer } from '../core';
import {
  AxisBase,
  AxisPosition,
  AxisLineStyle,
  AxisTextStyle,
} from './axis-base';

export class BandAxisConfig {
  padding = {
    inner: 0.5,
    outer: 0.2,
  };
  lineStyle = new AxisLineStyle();
  textStyle = new AxisTextStyle();
}

export class BandAxis extends AxisBase {
  scale: ScaleBand<any>;
  axis: Axis<any>;

  static create(config: BandAxisConfig, container: AxisContainer, domain: any[]) {
    const { selection, placement, range } = container;
    const axis = new BandAxis(config, selection, placement);
    axis.draw(domain, range);
    return axis;
  }

  constructor(
    public config: BandAxisConfig,
    selection: SelectionType,
    position: AxisPosition,
  ) {
    super(selection, position, config);
  }

  draw(domain: any[], range: [number, number]) {
    const { padding } = this.config;

    this.scale = d3.scaleBand()
      .domain(domain)
      .rangeRound(range)
      .paddingInner(padding.inner)
      .paddingOuter(padding.outer);

    this.axis = this.initAxis(this.position);
    this.selection.append('g')
      .attr('class', 'band-axis')
      .call(this.axis);

    this.styleLine();
    this.styleText();
  }

  center(x: string) {
    const bandWidth = this.scale.bandwidth();
    return this.scale(x) + bandWidth / 2;
  }
}
