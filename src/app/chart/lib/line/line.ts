import * as d3 from 'd3';
import * as moment from 'moment';
import { Selection, ScaleTime, ScaleLinear, Axis, Line } from 'd3';

import { ChartBase, SelectionType } from '../chart-base';
import { Legend, LegendConfig } from '../legend';
import { ColorSchema } from '../color-schema';
import { GeoService } from '../geo-service';
import { Grid } from '../grid';
import {
  LinearAxis,
  LinearAxisConfig,
  TimeAxis,
  TimeAxisConfig,
} from '../axis';
import { Tooltip } from '../tooltip';
import { EventListener } from '../event';

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

export class Point2D {
  topic: string;
  x: number;
  y: number;

  get id() {
    const { topic, x, y } = this;
    return `${topic}-${x}-${y}`;
  }
}

export class PointCollection {
  points: Point2D[] = [];

  constructor(points: Point2D[]) {
    this.points = points;
  }

  /**
   * x方向最近邻
   */
  nearestX(x: number) {
    let minDist = Infinity;
    let minPoints: Point2D[];
    this.points.forEach((point) => {
      const dist = Math.abs(point.x - x);
      if (minDist > dist) {
        minDist = dist;
        minPoints = [point];
      } else if (minDist === dist) {
        minPoints.push(point);
      }
    });

    return minPoints;
  }
}

export class LineChart implements ChartBase {
  data: LineChartData[] = [];
  config: LineChartConfig;
  element: HTMLElement;
  geo: GeoService;
  xAxis: TimeAxis;
  yAxis: LinearAxis;
  pointCollection: PointCollection;
  tooltip = new Tooltip();
  event: EventListener;

  constructor() {}

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
    this.initData();
    this.drawBackgroud();
    this.drawGrid();
    this.drawLines();
    this.drawLegend();
    this.initTooltip();

    return this;
  }

  /**
   * 事件  可以暂时不实现
   */
  on() {
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

    const canvasContainer = rootContainer.append('g').classed('chart-container', true);
    const eventContainer = rootContainer.append('g').classed('chart-event-container', true);

    const { width, height, margin, legend } = this.config;
    this.geo = GeoService.fromMarginContainer(canvasContainer, {width, height}, margin);

    this.event = new EventListener(eventContainer);

    if (legend.show) {
      this.geo.placeLegend(legend);
    }

    this.geo.placeGrid()
      .placeXAxis()
      .placeYAxis()
      .placeBackground();
  }

  initData() {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;

    const points = this.data.reduce((accum, dataset) => {
      return accum.concat(dataset.data.map((d) => {
        return {
          topic: dataset.topic,
          x: xScale(d.x),
          y: yScale(d.y),
        };
      }));
    }, []);

    this.pointCollection = new PointCollection(points);
  }

  initTooltip() {
    this.tooltip.draw();

    const canvas2d = this.geo.canvas2d;
    this.geo.canvas.append('rect')
      .classed('tipBox', true)
      .attr('width', canvas2d.width)
      .attr('height', canvas2d.height)
      .attr('opacity', 0)
      .on('mousemove', this.drawTooltip.bind(this))
      .on('mouseleave', this.removeTooltip.bind(this));

    // tooltip line
    this.geo.canvas.append('line').classed('tooltip-line', true);
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
      this.appendLineMarker(data, idx);
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
    if (!this.geo.container.selectAll('#line-shadow').size()) {
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

  appendLineMarker(data: LinePoint[], idx: number) {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;
    const points = data.map((d) => {
      return {
        x: xScale(d.x),
        y: yScale(d.y),
      };
    });
    const tooltipMarkers = this.geo.canvas.append('g')
    .classed('tooltip-marker-container', true)
    .selectAll('g')
    .data(points)
    .enter()
    .append('g')
    .classed('tooltip-marker', true)
    .attr('id', (p) => `tooltip-marker-${p.x}-${p.y}`);

    tooltipMarkers
    .append('circle')
    .classed('tooltip-marker-doublecircle-outer', true)
    .attr('fill', 'white')
    .attr('r', 2)
    .attr('stroke-width', 1)
    .attr('stroke', this.config.colorSchema.getColor(idx))
    .attr('transform', (p) => {
      return `translate(${p.x}, ${p.y})`;
    });

    tooltipMarkers
    .append('circle')
    .classed('tooltip-marker-doublecircle-inner', true)
    .attr('fill', this.config.colorSchema.getColor(idx))
    .attr('r', 2)
    .attr('transform', (p) => {
      return `translate(${p.x}, ${p.y})`;
    });
  }

  activateMarkers(points: Point2D[]) {
    const markerContainers = this.geo.canvas.selectAll('.tooltip-marker-container');
    markerContainers.selectAll('.tooltip-marker').classed('active', false);
    points.forEach((p) => {
      const markers = markerContainers.selectAll(`#tooltip-marker-${p.x}-${p.y}`);
      markers.classed('active', true);
    });
  }

  drawTooltip() {
    const xScale = this.xAxis.scale;
    const tipBox: any = this.geo.container.select('.tipBox');
    const mouseX = d3.mouse(tipBox.node())[0];
    const nearestPoints = this.pointCollection.nearestX(mouseX);
    const nearestPoint = nearestPoints[0];
    const tooltipLineColor = '#c2c9d5';

    this.geo.container.select('.tooltip-line')
    .attr('stroke', tooltipLineColor)
    .attr('stroke-wdith', 1)
    .attr('x1', nearestPoint.x)
    .attr('x2', nearestPoint.x)
    .attr('y1', 0)
    .attr('y2', this.geo.canvas2d.height);

    this.activateMarkers(nearestPoints);
    const tooltipItems = nearestPoints.map((p) => {
      const idx = this.data.findIndex((dataset) => {
        return dataset.topic === p.topic;
      });
      return {
        name: p.topic,
        value: p.y,
        color: this.config.colorSchema.getColor(idx),
      };
    });

    this.tooltip.show();
    this.tooltip.setPosition(d3.event.pageX, d3.event.pageY);
    this.tooltip.setContent('tooltip', tooltipItems);
  }

  removeTooltip() {
    // TODO: problem with tooltip
    console.log('removeTooltip');
    // this.geo.container.select('.tooltip-line').style('display', 'none');
  }
}
