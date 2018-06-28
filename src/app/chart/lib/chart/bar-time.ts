import * as d3 from 'd3';
import * as moment from 'moment';
import merge from 'lodash-es/merge';

import { Chart } from '../core';
import {
  LinearAxis,
  LinearAxisConfig,
  TimeAxisConfig,
  TimeAxis,
} from '../axis';
import {
  Grid,
  TooltipBundleCls,
  TooltipEvent,
  Tooltip,
  AxisIndicator,
} from '../component';
import { Bar } from '../shapes';
import { Point2D } from '../helpers/transform-helper';

export class BarPoint {
  x: Date;
  y: number;
}

export class BarTimeChartData {
  series: BarPoint[];

  static create(series: { x: string | Date, y: number }[]) {
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
    if (length === 0) {
      return [];
    } else if (length === 1) {
      return [this.series[0].x, this.series[0].x];
    }

    const duration = moment(this.series[0].x).diff(this.series[1].x);
    const end = this.series[length - 1].x;
    const start = moment(this.series[0].x).add(duration).toDate();
    return [start, end];
  }
}

export class BarTimeChartConfig {
  width: number;
  height: number;
  xAxis: TimeAxisConfig = {
    ...new TimeAxisConfig(),
    tick: {
      padding: 2,
      timeFormat: '%I:%M',
    },
  };
  yAxis = new LinearAxisConfig(5);
  hasAnimation = true;
  color = '#305ab5';
  background: string;
  margin = { top: 20, right: 50, bottom: 40, left: 50 };

  static from(config) {
    const _config = new BarTimeChartConfig();
    merge(_config, config);
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

export class BarTimeChart extends Chart<BarTimeChartConfig, BarTimeChartData> {
  xAxis: TimeAxis;
  yAxis: LinearAxis;
  grid: Grid;
  axisIndicator: AxisIndicator;

  private tooltip: Tooltip;

  setConfig(config: BarTimeChartConfig) {
    this.config = BarTimeChartConfig.from(config);
    return this;
  }

  datum(data: BarTimeChartData) {
    this.data = BarTimeChartData.create(data.series);
    return this;
  }

  draw() {
    const { width, height, margin } = this.config;
    this.init({width, height}, margin);
    this.drawAxis();
    this.drawGrid();

    this.drawBar();

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
    if (yAxis.grid !== false) {
      this.grid.drawY(this.yAxis.ticks(), yAxis.grid);
    }
  }

  initTooltip() {
    const objects: TooltipBundle[] = [];
    const { scale } = this.xAxis;
    const { color } = this.config;
    this.data.series.forEach((d) => {
      const x = scale(d.x);
      const object = new TooltipBundle(x);
      object.items.push({
        name:  this.xAxis.format(d.x),
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
    this.data.series.map(({x, y}) => {
      const from = new Point2D(xScale(x) - bandwidth / 2, yScale(0));
      const to = new Point2D(xScale(x) + bandwidth / 2, yScale(y));
      return new Bar(this.layout.canvas.selection)
      .from(this.coordinate.apply(from))
      .to(this.coordinate.apply(to))
      .color(this.config.color)
      .draw()
      .round(0.45 * bandwidth)
      .animate();
    });
  }
}
