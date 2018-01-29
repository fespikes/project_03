import * as d3 from 'd3';
import * as moment from 'moment';
import { Selection, ScaleTime, ScaleLinear, Axis, Line } from 'd3';

import { ChartBase, SelectionType } from './chart-base';
import { Legend, LegendConfig } from './legend';
import { ColorSchema } from './color-schema';
import { GeoService } from './geo-service';
import { Grid } from './grid';
import {
  LinearAxis,
  LinearAxisConfig,
  TimeAxis,
  TimeAxisConfig,
} from './axis';

export type curveStyle = 'curveLinear' | 'curveStep' | 'curveBasis'
  | 'curveCardinal' | 'curveMonotoneX' | 'curveCatmullRom';

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

export class LineChartConfig {
  width: number;
  height: number;
  xAxis = new TimeAxisConfig();
  yAxis = new LinearAxisConfig();
  hasAnimation = false;
  hasShadow = false;
  hasArea = false;
  areaColor = 'rgba(227,230,237, 0.5)';
  curveStyle: curveStyle = 'curveMonotoneX';
  margin = {top: 20, right: 50, bottom: 40, left: 50};
  background: string;
  colorSchema = new ColorSchema();
  legend = new LegendConfig();

  static from(config) {
    const _config = new LineChartConfig();
    Object.assign(_config, config);
    _config.colorSchema = ColorSchema.from(_config.colorSchema);
    _config.legend = LegendConfig.from(config.legend);
    return _config;
  }

  static toJson(config: LineChartConfig) {
    return JSON.stringify(config, null, 2);
  }
}

export class LineChart implements ChartBase {
  data: LineChartData[] = [];
  config: LineChartConfig;
  element: HTMLElement;
  geo: GeoService;
  xAxis: TimeAxis;
  yAxis: LinearAxis;

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
    this.initGeo();
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

  initGeo() {
    if (this.geo) {
      this.geo.clear();
    }
    const rootContainer = d3.select(this.element).append('svg')
    .attr('class', 'chart tdc-chart-line')
    .style('width', '100%')
    .style('height', '100%');

    const { width, height, margin, legend } = this.config;
    this.geo = GeoService.fromMarginContainer(rootContainer, {width, height}, margin);

    if (legend.show) {
      this.geo.placeLegend(legend);
    }

    this.geo.placeGrid()
      .placeXAxis()
      .placeYAxis()
      .placeBackground();
  }

  drawAxis() {
    const { xAxis, yAxis } = this.config;
    this.xAxis = new TimeAxis(xAxis, this.geo.xAxis, 'bottom');
    this.yAxis = new LinearAxis(yAxis, this.geo.yAxis, 'left');

    const allData = this.data.reduce((accum, d) => {
      return accum.concat(d.data);
    }, []);
    const allDataX = allData.map(d => d.x);
    const allDataY = allData.map(d => d.y);
    const { width, height } = this.geo.canvas2d;
    this.xAxis.draw(allDataX, [0, width]);
    this.yAxis.draw([0, d3.max(allDataY)], [height, 0]);
  }

  drawBackgroud() {
    if (this.config.background) {
      this.geo.background
        .attr('fill', this.config.background);
    }
  }

  drawGrid() {
    const { canvas2d, gridVertical, gridHorizontal } = this.geo;

    {
      const gridRenderer = new Grid(gridVertical, canvas2d);
      const { grid, tick } = this.config.xAxis;
      gridRenderer.draw(grid, tick.count, this.xAxis.scale, 'vertical');
    }
    {
      const gridRenderer = new Grid(gridHorizontal, canvas2d);
      const { grid, tick } = this.config.yAxis;
      gridRenderer.draw(grid, tick.count, this.yAxis.scale);
    }
  }

  drawLegend() {
    if (!this.config.legend.show) {
      return;
    }
    const legend = new Legend(this.config.colorSchema, this.config.legend);
    legend.draw(this.geo.legend, this.data.map((d) => d.topic), this.geo.legend2d);
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
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;

    const startLine = d3.line<LinePoint>()
      .x((d: any) => xScale(d.x))
      .y((d: any) => yScale(0))
      .curve(d3[this.config.curveStyle]);

    const finishLine = d3.line<LinePoint>()
      .x((d: any) => xScale(d.x))
      .y((d: any) => yScale(d.y))
      .curve(d3[this.config.curveStyle]);

    const line = this.geo.canvas.append('path')
      .attr('class', 'line')
      .attr('d', finishLine(data))
      .style('stroke', this.config.colorSchema.getColor(idx))
      .style('stroke-width', '2px')
      .style('fill', 'none')
      .style('shape-rendering', 'auto');

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
    // 如果没有定义shadow样式，则定义
    if (this.geo.container.selectAll('#line-shadow')) {
      const defs = this.geo.canvas.append('defs');
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
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;
    const { canvas2d } = this.geo;

    const startArea = d3.area<LinePoint>()
      .x((d: any) => xScale(d.x))
      .y0(canvas2d.height)
      .y1((d: any) => yScale(0))
      .curve(d3[this.config.curveStyle]);

    const finishArea = d3.area<LinePoint>()
      .x((d: any) => xScale(d.x))
      .y0(canvas2d.height)
      .y1((d: any) => yScale(d.y))
      .curve(d3[this.config.curveStyle]);

    if (this.config.hasArea) {
      const area = this.geo.canvas.append('path')
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
