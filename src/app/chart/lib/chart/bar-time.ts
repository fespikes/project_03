import * as d3 from 'd3';
import * as moment from 'moment';

import { Chart } from '../core';
import {
  LinearAxis,
  LinearAxisConfig,
  TimeAxisConfig,
  TimeAxis,
  BandAxisConfig,
} from '../axis';
import {
  Grid,
  TooltipBundleCls,
  TooltipEvent,
  Tooltip,
  AxisIndicator,
} from '../component';

export class BarPoint {
  x: Date;
  y: number;
}

export class BarTimeChartData {
  series: BarPoint[];

  static create(series: { x: string, y: number }[]) {
    const barTimeData = new BarTimeChartData();
    barTimeData.series = series.map(d => {
      return {
        x: moment(d.x).toDate(),
        y: d.y,
      };
    });
    return barTimeData;
  }

  get domain() {
    const length = this.series.length;
    const duration = moment(this.series[0].x).diff(this.series[1].x);
    const end = this.series[length - 1].x;
    const start = moment(this.series[0].x).subtract(duration).toDate();
    return [start, end];
  }
}

export class BarTimeChartConfig {
  width: number;
  height: number;
  xAxis: TimeAxisConfig = {
    ...new TimeAxisConfig(),
    tick: {
      useTimeInterval: true,
      count: 0,
      timeInterval: 'timeMinute',
      interval: 10,
      padding: 2,
      timeFormat: '%I:%M',
    },
  };
  yAxis = new LinearAxisConfig();
  hasAnimation = false;
  color = '#305ab5';
  background: string;
  margin = { top: 20, right: 50, bottom: 40, left: 50 };

  static from(config) {
    const _config = new BarTimeChartConfig();
    Object.assign(_config, config);
    return _config;
  }

  static toJson(config: BarTimeChartConfig) {
    return JSON.stringify(config, null, 2);
  }
}

class TooltipBundle extends TooltipBundleCls {
  constructor(x: number) {
    super();
    this.x = x;
    this.items = [];
  }

  distance(x: number, y: number) {
    return Math.abs(this.x - x);
  }
}

export class BarTimeChart extends Chart {
  data: BarTimeChartData;
  config: BarTimeChartConfig;
  element: HTMLElement;
  xAxis: TimeAxis;
  yAxis: LinearAxis;
  grid: Grid;
  axisIndicator: AxisIndicator;

  private tooltip;

  draw() {
    const { width, height, margin } = this.config;
    this.init({width, height}, margin);
    this.drawAxis();
    this.drawGrid();

    const bars = this.drawBar();
    this.appendAnimation(bars);

    this.initTooltip();
    return this;
  }

  drawAxis() {
    const { xAxis, yAxis } = this.config;
    const { xAxis: xContainer, yAxis: yContainer } = this.layout;
    this.xAxis = TimeAxis.create(xAxis, xContainer, this.data.domain);
    this.yAxis = LinearAxis.create(yAxis, yContainer, [0, d3.max(this.data.series.map(d => d.y))]);
  }

  drawGrid() {
    const { yAxis } = this.config;
    this.grid = new Grid(this.layout.grid);
    this.grid.drawY(this.yAxis.ticks(), yAxis.grid);
  }

  initTooltip() {
    const objects: TooltipBundle[] = [];
    const { scale } = this.xAxis;
    const { color } = this.config;
    this.data.series.forEach((d) => {
      const x = scale(d.x);
      const object = new TooltipBundle(x);
      object.items.push({
        name: d.x.toISOString(),
        value: d.y,
        color,
      });
      objects.push(object);
    });

    const tooltipEvent = new TooltipEvent(this.layout.canvas, objects);
    this.tooltip = new Tooltip(this.overlay.container)
      .boundary(this.layout.canvas.innerDim)
      .subscribe(tooltipEvent)
      .draw();
    this.axisIndicator = new AxisIndicator(this.grid, 'bar', this.bandWidth() + 4)
      .subscribe(tooltipEvent)
      .draw();
  }

  bandWidth() {
    // TODO: 有可能出现series中数据时间间隔不一  此时会有问题
    const dataSize = this.data.series.length;
    return (this.layout.canvas.dim.width - dataSize * this.config.xAxis.tick.padding) / dataSize;
  }

  drawBar() {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;

    const bandwidth = this.bandWidth();
    return this.layout.canvas.selection.selectAll('.bar')
      .data(this.data.series)
      .enter()
      .append('rect')
      .attr('class', '.bar')
      .attr('fill', this.config.color)
      .attr('x', (d, i) => xScale(d.x) - bandwidth / 2)
      .attr('width', (d, i) => bandwidth)
      .attr('y', (d) => yScale(0))
      .attr('height', 0)
      .attr('rx', bandwidth / 2.2);
  }

  appendAnimation(bars) {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;

    bars.transition()
      .delay((d, i) => i * 10)
      .attr('y', (d) => yScale(d.y))
      .attr('height', (d) => this.layout.canvas.dim.height - yScale(d.y));
  }
}
