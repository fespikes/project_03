import * as d3 from 'd3';
import * as moment from 'moment';

import { ChartBase } from './chart-base';
import { Selection, ScaleTime, ScaleLinear, Axis, Line } from 'd3';

export class LinePoint {
  x: Date;
  y: number;
}

export class LineChartData {
  topic: string;
  data: LinePoint[];

  static create(topic, data: {x: string, y: number}[]) {
    const lineData = new LineChartData();
    lineData.data = data.map((d) => {
      return {
        x: moment(d.x).toDate(),
        y: d.y,
      };
    });
    lineData.topic = topic;

    return lineData;
  }
}

export type SelectionType = Selection<any, any, any, any>;

export class LineChartConfig {
  width: number;
  height: number;
  xTicks: number;
  yTicks: number;
  hasAnimation = false;
  hasShadow = false;
  hasArea = false;
  areaColor = 'rgba(227,230,237, 0.5)';
  margin = {top: 20, right: 50, bottom: 40, left: 50};
  colorSchema = ['#336fd3', '#42c0df', '#9784eb', '#39c2c9', '#39c2c9', '#ffce00', '#ffa71a', '#f866b9'];
  gridType: 'vertical'|'horizontal'|'full';
  gridStyle: 'solid' | 'dash';
  background: string;
  legendAlign = 'left';
  legendWidth = 150;
  legendHeight = 30;
  legendAreaHeight = 30;

  static from(config) {
    const _config = new LineChartConfig();
    Object.assign(_config, config);
    return _config;
  }

  static toJson(config: LineChartConfig) {
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

export class LineChart implements ChartBase {
  data: LineChartData[] = [];
  config: LineChartConfig;
  element: HTMLElement;

  private xScale: ScaleTime<any, any>;
  private yScale: ScaleLinear<any, any>;
  private xAxis: Axis<any>;
  private yAxis: Axis<any>;
  private container: SelectionType;
  private canvas: SelectionType;

  constructor() {
  }

  setConfig(config: LineChartConfig) {
    this.config = config;
    return this;
  }

  select(element: HTMLElement) {
    this.element = element;
    return this;
  }

  datum(data: LineChartData[]) {
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
    this.drawBackgroud();
    this.drawGrid();
    this.drawLines();
    this.drawLegend();

    return this;
  }

  /**
   * 事件  可以暂时不实现
   */
  on() {
    console.error('TODO');
  }

  tooltip() {
    console.error('TODO');
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
        .attr('class', 'chart');
    }

    this.container
      .attr('width', this.config.width)
      .attr('height', this.config.height);

    this.canvas = this.container.append('g')
      .attr('transform', this.config.canvasTranslate);
  }

  initScale() {
    const allData = this.data.reduce((accum, d) => {
      return accum.concat(d.data);
    }, []);

    this.xScale = d3.scaleTime()
      .domain(d3.extent(allData, d => d.x))
      .rangeRound([0, this.config.canvasWidth]);

    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(allData, d => d.y)])
      .range([this.config.canvasHeight, 0]);
  }

  initAxis() {
    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(this.config.xTicks)
      .tickPadding(10)
      .tickFormat(d3.timeFormat('%x'));

    this.yAxis = d3.axisLeft(this.yScale)
      .ticks(this.config.yTicks)
      .tickPadding(10);
  }

  drawAxis() {
    // 横坐标
    this.canvas.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.config.canvasHeight})`)
      .call(this.xAxis);

    // 纵坐标
    this.canvas.append('g')
      .attr('class', 'yp axis')
      .call(this.yAxis);
  }

  drawBackgroud() {
    if (this.config.background) {
      const background = this.canvas
        .append('rect')
        .attr('width', this.config.canvasWidth)
        .attr('height', this.config.canvasHeight)
        .attr('fill', this.config.background);
    }
  }

  drawGrid() {
    const yTicks = this.config.yTicks;
    const xTicks = this.config.xTicks;

    const grid = this.canvas.append('g').attr('class', 'grid-group');
    const horizontalGrid = grid.append('g').attr('class', 'grid-horizontal');
    const verticalGrid = grid.append('g').attr('class', 'grid-vertical');
    if (this.config.gridType === 'horizontal' || this.config.gridType === 'full') {
      const line = horizontalGrid
        .selectAll('g')
        .data(this.yScale.ticks(yTicks))
        .enter()
          .append('line')
            .attr('class', 'grid-horizontal-line')
            .attr('x1', 0)
            .attr('x2', this.config.canvasWidth)
            .attr('y1', (d) => this.yScale(d))
            .attr('y2', (d) => this.yScale(d));

      if (this.config.gridStyle === 'dash') {
        line.attr('stroke-dasharray', '8, 4');
      }
    }

    if (this.config.gridType === 'vertical' || this.config.gridType === 'full') {
        const line = verticalGrid
          .selectAll('g')
          .data(this.xScale.ticks(xTicks))
          .enter()
            .append('line')
              .attr('class', 'grid-vertical-line')
              .attr('y1', 0)
              .attr('y2', this.config.canvasHeight)
              .attr('x1', (d) => this.xScale(d))
              .attr('x2', (d) => this.xScale(d));

        if (this.config.gridStyle === 'dash') {
          line.attr('stroke-dasharray', '8, 4');
        }
    }
  }

  drawLegend() {
    const legendHeight = 30;
    const legendTranslate = this.config.legendTranslate;

    const legend = this.container.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 14)
      .attr('text-anchor', 'start')
      .attr('transform', legendTranslate)
      .selectAll('g')
      .data(this.data)
      .enter().append('g')
      .attr('transform', (d, i) => {
        return this.config.getLegendTranslate(i);
      });

    legend.append('rect')
      .attr('x', 0)
      .attr('width', 16)
      .attr('height', 16)
      .attr('fill', (d, idx) => this.config.getColor(idx));

    legend.append('text')
      .attr('x', 20)
      .attr('y', 9)
      .attr('dy', '0.32em')
      .text((d) => d.topic);
  }

  drawLines() {
    this.data.forEach((dataset, idx) => {
      const data = dataset.data;
      const line = this.drawLine(data, idx);
      this.appendShadow(line);
      this.appendArea(data);
    });
  }

  drawLine(data: LinePoint[], idx = 0) {
    const startLine = d3.line<LinePoint>()
      .x((d: any) => this.xScale(d.x))
      .y((d: any) => this.yScale(0))
      .curve(d3.curveMonotoneX);

    const finishLine = d3.line<LinePoint>()
      .x((d: any) => this.xScale(d.x))
      .y((d: any) => this.yScale(d.y))
      .curve(d3.curveMonotoneX);

    const line = this.canvas.append('path')
      .attr('class', 'line')
      .attr('d', finishLine(data))
      .style('stroke', this.config.getColor(idx))
      .style('stroke-width', '2px');

    if (this.config.hasAnimation) {
      line
      .append('animate')
      .attr('dur', '1s')
      .attr('attributeName', 'd')
      .attr('calcMode', 'spline')
      .attr('keyTimes', '0; 1')
      .attr('keySplines', '.5 0 .5 1')
      .attr('from', startLine(data))
      .attr('to', finishLine(data));
    }

    return line;
  }

  appendShadow(line: SelectionType) {
    const defs = this.canvas.append('defs');

    // 如果没有定义shadow样式，则定义
    if (this.container.selectAll('#line-shadow')) {
      const filter = defs.append('filter')
        .attr('id', 'line-shadow')
        .attr('height', '130%');

      filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('color', '#ccc')
        .attr('stdDeviation', 3)
        .attr('result', 'blur');

      filter.append('feOffset')
        .attr('in', 'blur')
        .attr('dx', 3)
        .attr('dy', 5)
        .attr('result', 'offsetBlur');

      filter.append('feComponentTransfer')
        .append('feFuncA')
          .attr('type', 'linear')
          .attr('slope', '0.2');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode');
      feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');
    }

    if (this.config.hasShadow) {
      line.style('filter', 'url(#line-shadow)');
    }
  }

  appendArea(data: LinePoint[]) {
    const startArea = d3.area<LinePoint>()
      .x((d: any) => this.xScale(d.x))
      .y0(this.config.canvasHeight)
      .y1((d: any) => this.yScale(0))
      .curve(d3.curveMonotoneX);

    const finishArea = d3.area<LinePoint>()
      .x((d: any) => this.xScale(d.x))
      .y0(this.config.canvasHeight)
      .y1((d: any) => this.yScale(d.y))
      .curve(d3.curveMonotoneX);

    if (this.config.hasArea) {
      const area = this.canvas.append('path')
      .attr('class', 'area')
      .attr('d', finishArea(data))
      .attr('fill', this.config.areaColor);

      if (this.config.hasAnimation) {
        area
        .append('animate')
        .attr('dur', '1s')
        .attr('attributeName', 'd')
        .attr('calcMode', 'spline')
        .attr('keyTimes', '0; 1')
        .attr('keySplines', '.5 0 .5 1')
        .attr('from', startArea(data))
        .attr('to', finishArea(data));
      }
    }
  }
}
