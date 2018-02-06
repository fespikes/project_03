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
import { Overlay } from '../overlay';
import { AxisLine } from '../axis-line';
import { MarkerFactory, MarkerBase } from './marker';
import { Point2D } from '../helpers/transform-helper';
import { InteractionSurface, InteractionObject } from '../interaction-surface';

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
  overlay: Overlay;
  axisLine: AxisLine;

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

export class GeomPoint {
  point: Point2D;
  datum: LinePoint;
  topic: string;

  get x() {
    return this.point.x;
  }

  get y() {
    return this.point.y;
  }

  static create(point: Point2D, datum: LinePoint, topic: string) {
    const gp = new GeomPoint();
    gp.point = point;
    gp.datum = datum;
    gp.topic = topic;

    return gp;
  }
}

export class InteractionXAxisObject implements InteractionObject {
  x: number;
  markers: MarkerBase[] = [];
  points: GeomPoint[] = [];

  constructor(x: number) {
    this.x = x;
  }

  addPair(point: GeomPoint, marker: MarkerBase) {
    this.markers.push(marker);
    this.points.push(point);
  }

  distance(x: number, y: number) {
    return Math.abs(this.x - x);
  }

  activate() {
    this.markers.forEach((marker) => marker.activate());
  }

  deactivate() {
    this.markers.forEach((marker) => marker.deactivate());
  }
}


export class LineChart implements ChartBase {
  data: LineChartData[] = [];
  config: LineChartConfig;
  element: HTMLElement;
  geo: GeoService;
  xAxis: TimeAxis;
  yAxis: LinearAxis;
  // pointCollection: PointCollection;
  tooltip: Tooltip;
  overlay: Overlay;
  axisLine: AxisLine;
  interactionSurface: InteractionSurface;

  get rootContainer() {
    return d3.select(this.element);
  }

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

  initGeo() {
    if (this.overlay) {
      this.overlay.clear();
    }
    const overlayContainer = this.rootContainer.append('div');

    const rootContainer = overlayContainer.append('svg')
    .attr('class', 'chart tdc-chart-line')
    .style('width', '100%')
    .style('height', '100%');

    const { width, height, margin, legend } = this.config;

    this.geo = GeoService.fromMarginContainer(rootContainer, {width, height}, margin);

    if (legend.show) {
      this.geo.placeLegend(legend);
    }

    this.overlay = new Overlay(overlayContainer, {width, height});

    this.geo.placeGrid()
      .placeXAxis()
      .placeYAxis()
      .placeBackground();
  }

  initData() {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;

    const markerContainer = this.geo.canvas.append('g')
    .classed('tooltip-marker-container', true);

    const objectMap = {};
    this.data.forEach((dataset, idx) => {
      const color = this.config.colorSchema.getColor(idx);
      dataset.data.forEach((d) => {
        const center = {
          x: xScale(d.x),
          y: yScale(d.y),
        };
        const gp = GeomPoint.create(center, d, dataset.topic);
        const marker = MarkerFactory.createMarker(markerContainer, {center, color});
        if (!objectMap[center.x]) {
          objectMap[center.x] = new InteractionXAxisObject(center.x);
        }
        objectMap[center.x].addPair(gp, marker);
      });
    });

    const objects = Object.keys(objectMap).map((key) => objectMap[key]);
    this.interactionSurface = new InteractionSurface();
    this.interactionSurface
      .watch(this.overlay.container)
      .setObjects(objects)
      .on('activeChange', (active: InteractionXAxisObject) => {
        const format = d3.timeFormat(this.config.xAxis.tick.timeFormat);
        const title = format(active.points[0].datum.x);
        this.axisLine.show();
        this.axisLine.move(active.x);

        const tooltipItems = active.markers.map((marker, idx) => {
          const point = active.points[idx];
          return {
            name: point.topic,
            value: point.datum.y,
            color: marker.color,
          };
        });

        this.tooltip.show();
        this.tooltip.setContent(title, tooltipItems);
      })
      .on('inactive', () => {
        this.axisLine.hide();
        this.tooltip.hide();
      })
      .on('mouseCoordChange', (mouseCoord) => {
        const [x, y] = mouseCoord;
        this.tooltip.setPosition(x, y);
      });
  }

  initTooltip() {
    this.tooltip = new Tooltip(this.overlay.container);
    this.tooltip.draw();
    this.axisLine = new AxisLine(this.geo.canvas);
    this.axisLine.draw('#c2c9d5', 'vertical', this.geo.canvas2d.height);
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
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;
    this.data.forEach((dataset, idx) => {
      const points = dataset.data.map((d) => {
        const center = {
          x: xScale(d.x),
          y: yScale(d.y),
        };
        // return this.pointCollection.getPointByDatum(d);
        const gp = GeomPoint.create(center, d, dataset.topic);
        return gp;
      });
      const line = this.drawLine(points, idx);
      this.appendShadow(line);
      this.appendArea(points);
    });
  }

  drawLine(data: GeomPoint[], idx = 0) {
    const startLine = d3.line<GeomPoint>()
      .x((p) => p.x)
      .y(0)
      .curve(d3[this.config.curveStyle]);

    const finishLine = d3.line<GeomPoint>()
      .x((p) => p.x)
      .y((p) => p.y)
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

  appendArea(points: GeomPoint[]) {
    const { canvas2d } = this.geo;

    const startArea = d3.area<GeomPoint>()
      .x((p) => p.x)
      .y0(canvas2d.height)
      .y1(0)
      .curve(d3[this.config.curveStyle]);

    const finishArea = d3.area<GeomPoint>()
      .x((p) => p.x)
      .y0(canvas2d.height)
      .y1((p) => p.y)
      .curve(d3[this.config.curveStyle]);

    if (this.config.hasArea) {
      const area = this.geo.canvas.append('path')
      .attr('class', 'area')
      .attr('d', finishArea(points))
      .attr('fill', this.config.areaColor);

      if (this.config.hasAnimation) {
        area
        .append('animate')
        .attr('dur', '1s')
        .attr('attributeName', 'd')
        .attr('calcMode', 'spline')
        .attr('keyTimes', '0; 1')
        .attr('keySplines', '.5 0 .5 1')
        .attr('from', startArea(points))
        .attr('to', finishArea(points));
      }
    }
  }
}
