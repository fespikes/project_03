import * as d3 from 'd3';
import * as moment from 'moment';
import { Selection, ScaleTime, ScaleLinear, Axis, Line } from 'd3';

import { ChartBase, SelectionType } from '../chart-base';
import { Chart } from '../chart';
import { Legend, LegendConfig } from '../legend';
import { ColorSchema } from '../color-schema';
import { GeoService } from '../geo-service';
import { Grid } from '../tooltip/grid';
import {
  LinearAxis,
  LinearAxisConfig,
  TimeAxis,
  TimeAxisConfig,
} from '../axis';
import { MarkerFactory, MarkerBase } from './marker';
import { Point2D } from '../helpers/transform-helper';
import { Tooltip, TooltipEvent, TooltipBundleCls, AxisIndicator } from '../tooltip';
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

class TooltipBundle implements TooltipBundleCls {
  x: number;
  title: string;
  points: MarkerPoint[] = [];

  get items() {
    return this.points.map((point) => {
      return {
        name: point.topic,
        value: point.datum.y,
        color: point.marker.color,
      };
    });
  }

  constructor(x: number, title: string) {
    this.x = x;
    this.title = title;
  }

  addPoint(point: MarkerPoint) {
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


export class LineChart extends Chart {
  data: LineChartData[] = [];
  config: LineChartConfig;
  element: HTMLElement;
  xAxis: TimeAxis;
  yAxis: LinearAxis;
  grid: Grid;
  tooltip: Tooltip;
  axisIndicator: AxisIndicator;
  points: MarkerPoint[][] = [];

  draw() {
    const { width, height, margin, legend, colorSchema } = this.config;
    this.init({width, height}, margin, legend);

    this.drawAxis();
    this.drawBackgroud();
    this.drawGrid();
    this.initData();
    this.initTooltip();
    this.drawLines();
    this.drawLegend(legend, colorSchema, this.data.map((d) => d.topic));

    return this;
  }

  initData() {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;

    // 数据点的坐标，marker，topic信息集合结构
    this.points = this.data.map((dataset, idx) => {
      const color = this.config.colorSchema.getColor(idx);
      return dataset.data.map((d) => {
        const center = {
          x: xScale(d.x),
          y: yScale(d.y),
        };
        const marker = MarkerFactory.createMarker(this.layout.canvas.selection, {center, color});
        return new MarkerPoint(dataset.topic, d, center, marker);
      });
    });
  }

  drawAxis() {
    const allData = this.data.reduce((accum, d) => {
      return accum.concat(d.data);
    }, []);
    const allDataX = allData.map(d => d.x);
    const allDataY = allData.map(d => d.y);

    const { xAxis, yAxis } = this.config;
    const { xAxis: xContaienr, yAxis: yContainer } = this.layout;
    this.xAxis = TimeAxis.create(xAxis, xContaienr, allDataX);
    this.yAxis = LinearAxis.create(yAxis, yContainer, [0, d3.max(allDataY)]);
  }

  initTooltip() {
    const objectMap = {};
    this.points.forEach((series) => {
      series.forEach((point) => {
        const x = point.coord.x;
        if (!objectMap[x]) {
          const title = this.xAxis.format(point.datum.x);
          objectMap[x] = new TooltipBundle(x, title);
        }
        objectMap[x].addPoint(point);
      });
    });
    const objects = Object.keys(objectMap).map((key) => objectMap[key]);

    const tooltipEvent = new TooltipEvent(this.layout.canvas, objects);
    this.tooltip = new Tooltip(this.overlay.container).draw().subscribe(tooltipEvent);
    this.axisIndicator = new AxisIndicator(this.grid, 'line').draw().subscribe(tooltipEvent);
  }

  drawGrid() {
    const { xAxis, yAxis } = this.config;
    this.grid = new Grid(this.layout.grid);
    this.grid.drawX(this.xAxis.ticks(), xAxis.grid);
    this.grid.drawY(this.yAxis.ticks(), yAxis.grid);
  }

  drawLines() {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;
    this.points.forEach((series, idx) => {
      const points = series.map((p) => p.coord);
      const { hasAnimation, hasShadow, hasArea, areaColor } = this.config;
      const path = ShapeFactory.drawPath(this.layout.canvas.selection, points, { color: this.config.colorSchema.getColor(idx) })
      .animate(hasAnimation)
      .shadow(hasShadow)
      .area(hasArea, {color: areaColor, animation: hasAnimation, canvasHeight: this.layout.canvas.dim.height});
    });
  }
}
