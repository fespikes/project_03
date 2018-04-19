import * as d3 from 'd3';
import { ScaleOrdinal } from 'd3';

import {
  CanvasContainer,
  Chart,
  Coordinate,
  SelectionType,
} from '../core';
import {
  LinearAxis,
  LinearAxisConfig,
  BandAxis,
  BandAxisConfig,
} from '../axis';
import {
  Grid,
  ColorSchema,
  Legend,
  LegendConfig,
  TooltipBundleCls,
  TooltipItem,
  TooltipEvent,
  Tooltip,
  AxisIndicator,
} from '../component';
import { Point2D, Rect2D } from '../helpers/transform-helper';


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
  yAxis = new LinearAxisConfig();
  background: string;
  margin = {top: 20, right: 50, bottom: 40, left: 50};
  colorSchema = new ColorSchema();
  legend = new LegendConfig();
  transpose = true;

  static from(config) {
    const _config = new BarChartConfig();
    Object.assign(_config, config);
    _config.colorSchema = ColorSchema.from(_config.colorSchema);
    _config.legend = LegendConfig.from(_config.legend);
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

export class BarChart extends Chart {
  data: BarChartData;
  config: BarChartConfig;
  element: HTMLElement;
  xAxis: BandAxis;
  yAxis: LinearAxis;

  private ordinalScale: ScaleOrdinal<any, any>;
  grid: Grid;
  tooltip: Tooltip;
  axisIndicator: AxisIndicator;

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

class Bar {
  selection: SelectionType;
  private fill: string;
  private p1: Point2D;
  private p2: Point2D;

  get shape() {
    return this.selection.select('rect');
  }

  get width() {
    return Math.abs(this.p1.x - this.p2.x);
  }

  get height() {
    return Math.abs(this.p1.y - this.p2.y);
  }

  /**
   * rect base 需取小的坐标值
   */
  get base() {
    const { p1, p2 } = this;
    const x = p1.x < p2.x ? p1.x : p2.x;
    const y = p1.y < p2.y ? p1.y : p2.y;
    return new Point2D(x, y);
  }

  get top() {
    const { p1, p2 } = this;
    const x = p1.x > p2.x ? p1.x : p2.x;
    const y = p1.y > p2.y ? p1.y : p2.y;
    return new Point2D(x, y);
  }

  constructor(selection: SelectionType) {
    this.selection = selection.append('g');
  }

  from(from: Point2D) {
    this.p1 = from;
    return this;
  }

  to(to: Point2D) {
    this.p2 = to;
    return this;
  }

  color(color: string) {
    this.fill = color;
    return this;
  }

  draw() {
    const { width, height } = this;
    const { x, y } = this.base;
    this.selection.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', this.fill)
    .attr('x', x)
    .attr('y', y);

    return this;
  }

  animate(horizontal = false) {
    if (!horizontal) {
      this.shape.attr('height', 0)
        .attr('y', this.top.y)
        .transition()
          .attr('y', this.base.y)
          .attr('height', this.height);
    } else {
      this.shape.attr('width', 0)
        .transition()
          .attr('width', this.width);
    }
  }
}
