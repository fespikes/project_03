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
import { ShapeFactory } from '../shapes';

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

export class MarkerPoint {
  marker: MarkerBase;
  datum: LinePoint;
  coord: Point2D;
  topic: string;

  constructor(topic: string, datum: LinePoint, coord: Point2D, marker: MarkerBase) {
    this.topic = topic;
    this.datum = datum;
    this.coord = coord;
    this.marker = marker;
  }
}

export class InteractionXAxisObject implements InteractionObject {
  x: number;
  points: MarkerPoint[] = [];

  constructor(x: number) {
    this.x = x;
  }

  addPair(point: MarkerPoint) {
    this.points.push(point);
  }

  distance(x: number, y: number) {
    return Math.abs(this.x - x);
  }

  activate() {
    this.points.forEach((p) => p.marker.activate());
  }

  deactivate() {
    this.points.forEach((p) => p.marker.deactivate());
  }
}


export class LineChart implements ChartBase {
  data: LineChartData[] = [];
  config: LineChartConfig;
  element: HTMLElement;
  geo: GeoService;
  xAxis: TimeAxis;
  yAxis: LinearAxis;
  tooltip: Tooltip;
  overlay: Overlay;
  axisLine: AxisLine;
  interactionSurface: InteractionSurface;
  points: MarkerPoint[][] = [];

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
    this.points = this.data.map((dataset, idx) => {
      const color = this.config.colorSchema.getColor(idx);
      return dataset.data.map((d) => {
        const center = {
          x: xScale(d.x),
          y: yScale(d.y),
        };
        const marker = MarkerFactory.createMarker(markerContainer, {center, color});
        return new MarkerPoint(dataset.topic, d, center, marker);
      });
    });

    this.points.forEach((series) => {
      series.forEach((point) => {
        const x = point.coord.x;
        if (!objectMap[x]) {
          objectMap[x] = new InteractionXAxisObject(x);
        }
        objectMap[x].addPair(point);
      });
    });

    this.tooltip = new Tooltip(this.overlay.container);
    this.tooltip.draw();
    this.axisLine = new AxisLine(this.geo.canvas);
    this.axisLine.draw('#c2c9d5', 'vertical', this.geo.canvas2d.height);

    const objects = Object.keys(objectMap).map((key) => objectMap[key]);
    this.interactionSurface = new InteractionSurface();
    this.interactionSurface
      .watch(this.geo.container)
      .setObjects(objects)
      .on('activeChange', (active: InteractionXAxisObject) => {
        const format = d3.timeFormat(this.config.xAxis.tick.timeFormat);
        const title = format(active.points[0].datum.x);
        this.axisLine.show();
        this.axisLine.move(active.x);

        const tooltipItems = active.points.map((point, idx) => {
          return {
            name: point.topic,
            value: point.datum.y,
            color: point.marker.color,
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
    this.points.forEach((series, idx) => {
      const points = series.map((p) => p.coord);
      const { hasAnimation, hasShadow, hasArea, areaColor } = this.config;
      const line = ShapeFactory.drawLine(this.geo.canvas, points, { color: this.config.colorSchema.getColor(idx) })
      .animate(hasAnimation)
      .shadow(hasShadow)
      .area(hasArea, {color: areaColor, animation: hasAnimation, canvasHeight: this.geo.canvas2d.height});
    });
  }
}
