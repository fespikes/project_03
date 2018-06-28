import * as d3 from 'd3';
import { ScaleOrdinal } from 'd3';
import merge from 'lodash-es/merge';

import { Chart } from '../core';
import {
  LinearAxis,
  LinearAxisConfig,
  BandAxis,
  BandAxisConfig,
} from '../axis';
import {
  Grid,
  ColorSchema,
  LegendConfig,
  TooltipBundleCls,
  TooltipEvent,
  Tooltip,
  AxisIndicator,
} from '../component';
import { Bar } from '../shapes';
import { Point2D } from '../helpers/transform-helper';


export class BarChartData {
  xs: string[];
  series: {
    topic: string;
    data: number[],
  }[];

  static create(data) {
    const barData = new BarChartData();
    Object.assign(barData, data);
    return barData;
  }
  /**
   * series里最大值
   */
  get top() {
    const yMax = [];
    this.series.forEach((d) => {
      const ys = d.data;
      ys.forEach((y, i) => {
        if (yMax.length <= i) {
          yMax.push(y);
        } else {
          yMax[i] = yMax[i] > y ? yMax[i] : y;
        }
      });
    });

    return d3.max(yMax);
  }
  /**
   * stack时每个bar的最大值
   */
  get stackTop() {
    const tops = this.xs.map((x) => this.getTotal(x));
    return d3.max(tops);
  }

  get topics() {
    return this.series.map((s) => s.topic);
  }


  /**
   * xs长度的数组，每组为各个topic在该x的值
   */
  get dataByTopic(): {[key: string]: number}[] {
    return this.xs.map((x, i) => {
      return this.series.reduce((accum, s) => {
        accum[s.topic] = s.data[i];
        return accum;
      }, {});
    });
  }

  /**
   * 获取在x，top的值
   * @param  {string} x
   * @param  {string} topic
   */
  getDataAt(x: string, topic: string) {
    const xIdx = this.xs.indexOf(x);
    const yIdx = this.series.findIndex(d => d.topic === topic);

    return this.series[yIdx].data[xIdx];
  }

  getTotal(x: string) {
    return this.series.reduce((accum, d) => {
      return accum + this.getDataAt(x, d.topic);
    }, 0);
  }
}

export class BarChartConfig {
  width: number;
  height: number;
  stack = false;
  xAxis = new BandAxisConfig();
  yAxis = new LinearAxisConfig(5);
  background: string;
  margin = {top: 20, right: 50, bottom: 40, left: 50};
  colorSchema = new ColorSchema();
  legend = new LegendConfig();
  transpose = false;

  static from(config) {
    const _config = new BarChartConfig();
    merge(_config, config);
    return _config;
  }

  static toJson(config: BarChartConfig) {
    return JSON.stringify(config, null, 2);
  }
}

class TooltipBundle extends TooltipBundleCls {
  constructor(x: number, title: string) {
    super();
    this.x = x;
    this.title = title;
    this.items = [];
  }

  distance(x: number, y: number) {
    return Math.abs(this.x - x);
  }
}

export class BarChart extends Chart<BarChartConfig, BarChartData> {
  xAxis: BandAxis;
  yAxis: LinearAxis;

  private ordinalScale: ScaleOrdinal<any, any>;
  grid: Grid;
  tooltip: Tooltip;
  axisIndicator: AxisIndicator;

  setConfig(config: BarChartConfig) {
    this.config = BarChartConfig.from(config);
    return this;
  }

  datum(data: BarChartData) {
    this.data = BarChartData.create(data);
    return this;
  }

  draw() {
    const { width, height, margin, legend, colorSchema, stack } = this.config;
    this.init({width, height}, margin, legend);

    this.drawAxis();
    this.drawGrid();
    this.drawBars();
    this.drawLegend(legend, colorSchema, this.data.topics);
    this.initTooltip();

    return this;
  }

  initTooltip() {
    const { scale } = this.xAxis;
    const objectMap: {[key: string]: TooltipBundleCls} = {};

    this.data.series.forEach((series, i) => {
      const topic = series.topic;
      const color = this.config.colorSchema.getColor(i);
      series.data.forEach((data, idx) => {
        const title = this.data.xs[idx];
        if (!objectMap[title]) {
          const x = this.xAxis.center(title);
          objectMap[title] = new TooltipBundle(x, title)  ;
        }
        objectMap[title].items.push({
          name: topic,
          value: data,
          color,
        });
      });
    });
    const objects = Object.keys(objectMap).map((key) => objectMap[key]);

    const tooltipEvent = new TooltipEvent(this.layout.canvas, objects, this.config.transpose);
    this.tooltip = new Tooltip(this.overlay.container)
      .boundary(this.layout.canvas.innerDim)
      .subscribe(tooltipEvent)
      .draw();
    const bandwidth = this.xAxis.scale.bandwidth();
    this.axisIndicator = new AxisIndicator(this.grid, 'bar', bandwidth + 20, this.config.transpose)
      .subscribe(tooltipEvent)
      .draw();
  }

  drawAxis() {
      let yTop;
      if (this.config.stack) {
        yTop = this.data.stackTop;
      } else {
        yTop = this.data.top;
      }
      const { xAxis, yAxis } = this.config;
      const { xAxis: xContainer, yAxis: yContainer } = this.layout;
      if (this.config.transpose) {
        this.xAxis = BandAxis.create(xAxis, yContainer, this.data.xs);
        this.yAxis = LinearAxis.create(yAxis, xContainer, [0, yTop]);
      } else {
        this.xAxis = BandAxis.create(xAxis, xContainer, this.data.xs);
        this.yAxis = LinearAxis.create(yAxis, yContainer, [0, yTop]);
      }

      this.ordinalScale = d3.scaleOrdinal()
        .range(this.config.colorSchema.palette);
  }

  drawGrid() {
    const { yAxis, xAxis } = this.config;
    this.grid = new Grid(this.layout.grid);
    if (yAxis.grid === false) {
      return;
    }
    if (this.config.transpose) {
      this.grid.drawX(this.yAxis.ticks(), yAxis.grid);
    } else {
      this.grid.drawY(this.yAxis.ticks(), yAxis.grid);
    }
  }

  drawBars() {
    const xScale = this.xAxis.scale;
    const yScale = this.yAxis.scale;
    const selection = this.layout.canvas.selection;
    const xSubScale = d3.scaleBand().domain(this.data.topics).rangeRound([0, xScale.bandwidth()]);
    const bars = [];
    const barWidth = this.getBarWidth();
    const accum = this.data.xs.map(() => 0);

    this.data.series.forEach((d) => {
      d.data.forEach((value, i) => {
        const color = this.ordinalScale(d.topic);
        const barHeight = yScale(value);
        let x1, y1, x2, y2;
        // 纵向堆叠，每次记录上一次堆叠高度
        if (this.config.stack) {
          x1 = xScale(this.data.xs[i]);
          y1 = accum[i];
          x2 = x1 + barWidth;
          y2 = y1 + barHeight;
          accum[i] = y2;
        } else {
          x1 = xScale(this.data.xs[i]) + xSubScale(d.topic);
          y1 = yScale(0);
          x2 = x1 + barWidth;
          y2 = barHeight;
        }

        const bar = new Bar(selection)
        .from(this.coordinate.apply(new Point2D(x1, y1)))
        .to(this.coordinate.apply(new Point2D(x2, y2)))
        .color(color);
        bars.push(bar);
      });
    });
    bars.forEach((bar) => bar.draw().animate(this.config.transpose));
  }

  getBarWidth() {
    if (this.config.stack) {
      return this.xAxis.scale.bandwidth();
    } else {
      const scale = d3.scaleBand().domain(this.data.topics).rangeRound([0, this.xAxis.scale.bandwidth()]);
      return scale.bandwidth();
    }
  }
}
