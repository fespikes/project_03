import * as d3 from 'd3';

import { ChartBase } from './chart-base';
import {
  ScaleLinear,
  ScaleBand,
  ScaleOrdinal,
  Stack,
  Axis,
  Selection,
} from 'd3';

export class BarChartData {
  xs: string[];
  stack = false;
  data: {
    topic: string;
    ys: number[],
  }[];

  static create(data) {
    const barData = new BarChartData();
    Object.assign(barData, data);
    return barData;
  }

  get top() {
    const yMax = [];
    this.data.forEach((d) => {
      const ys = d.ys;
      ys.forEach((y, i) => {
        if (yMax.length <= i) {
          yMax.push(y);
        } else if (this.stack) {
          yMax[i] += y;
        } else {
          yMax[i] = yMax[i] > y ? yMax[i] : y;
        }
      });
    });

    return d3.max(yMax);
  }
}

export class BarChartConfig {
  width: number;
  height: number;
  yTicks: number;
  hasAnimation = false;
  background: string;
  margin = {top: 20, right: 50, bottom: 40, left: 50};
  colorSchema = ['#305ab5', '#5e8ce9', '#4aa3d6', '#ab7ad5', '#42c0df', '#8b7ad5', '#336fd3', '#5eade9'];
  legendAlign = 'left';
  legendWidth = 150;
  legendHeight = 30;
  legendAreaHeight = 30;

  static from(config) {
    const _config = new BarChartConfig();
    Object.assign(_config, config);
    return _config;
  }

  static toJson(config: BarChartConfig) {
    return JSON.stringify(config, null, 2);
  }

  get canvasWidth(): number {
    return this.width - this.margin.left - this.margin.right;
  }
  get canvasHeight(): number {
    return this.height - this.margin.bottom - this.marginTop;
  }

  get marginTop() {
    return this.margin.top + this.legendAreaHeight;
  }

  get canvasTranslate() {
    return `translate(${this.margin.left}, ${this.marginTop})`;
  }

  get legendTranslate() {
    let legendTranslate = `translate(60, ${this.margin.top})`;
    if (this.legendAlign === 'right') {
      // 需要考虑legend自身的长度
      const toLeft = this.width - this.legendWidth - this.margin.right;
      legendTranslate = `translate(${toLeft}, ${this.margin.top})`;
    }

    return legendTranslate;
  }

  /**
   * 从colorSchma返回对应的颜色
   * @param  {number} index
   */
  getColor(index: number) {
    const rounded = index % this.colorSchema.length;
    return this.colorSchema[rounded];
  }

  getLegendTranslate(index: number) {
    const legendPerCol = Math.floor(this.legendAreaHeight / this.legendHeight);
    const col = Math.floor(index / legendPerCol);
    const idx = index % legendPerCol;
    if (this.legendAlign === 'left') {
      return `translate(${col * this.legendWidth}, ${this.legendHeight * idx})`;
    } else {
      return `translate(${- col * this.legendWidth}, ${this.legendHeight * idx})`;
    }
  }
}

export type SelectionType = Selection<any, any, any, any>;

export class BarChart implements ChartBase {
  data: BarChartData;
  config: BarChartConfig;
  element: HTMLElement;

  private xScale: ScaleBand<any>;
  private yScale: ScaleLinear<any, any>;
  private ordinalScale: ScaleOrdinal<any, any>;
  private stack: Stack<any, any, any>;
  private xAxis: Axis<any>;
  private yAxis: Axis<any>;
  private container: SelectionType;
  private canvas: SelectionType;

  setConfig(config: BarChartConfig) {
    this.config = config;
    return this;
  }

  select(element: HTMLElement) {
    this.element = element;
    return this;
  }

  datum(data: BarChartData) {
    this.data = data;
    return this;
  }

  draw() {
    if (this.container) {
      this.clear();
    }

    this.initCanvas();
    this.initScale();
    this.initAxis();
    this.drawAxis();
    this.drawBar();

    return this;
  }

  clear() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }

  initCanvas() {
    if (!this.container) {
      this.container = d3.select(this.element)
        .append('svg')
        .attr('class', 'tdc-chart-bar');
    }

    this.container
      .attr('width', this.config.width)
      .attr('height', this.config.height);

    this.canvas = this.container.append('g')
      .attr('transform', this.config.canvasTranslate);
  }

  initScale() {
    this.xScale = d3.scaleBand()
      .domain(this.data.xs)
      .rangeRound([0, this.config.canvasWidth])
      .paddingInner(0.5)
      .paddingOuter(0.2);

    this.yScale = d3.scaleLinear()
      .domain([0, this.data.top])
      .rangeRound([0, this.config.canvasHeight]);

    this.ordinalScale = d3.scaleOrdinal()
      .range(['#f7f8fc']);

    this.stack = d3.stack();
  }

  initAxis() {
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);
  }

  drawAxis() {
    this.canvas.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.config.canvasHeight})`)
      .call(this.xAxis);

    this.canvas.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);
  }

  drawBar() {
    console.log('this.data.data[0]', this.data.data[0]);

    this.canvas.append('g')
      .selectAll('.bar')
      .data(this.data.xs)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (x) => this.xScale(x))
      .attr('y', (d, i) => this.config.canvasHeight - this.yScale(this.data.data[0].ys[i]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', (d, i) => this.yScale(this.data.data[0].ys[i]));
  }
}
