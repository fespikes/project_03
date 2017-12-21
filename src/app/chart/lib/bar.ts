import * as d3 from 'd3';
import {
  ScaleLinear,
  ScaleBand,
  ScaleOrdinal,
  Stack,
  Axis,
  Selection,
} from 'd3';

import { ChartBase, SelectionType } from './chart-base';
import { ColorSchema } from './color-schema';
import { Legend, LegendConfig } from './legend';
import { GeoService } from './geo-service';


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

  get stackTop() {
    const tops = this.xs.map((x) => this.getTotal(x));
    return d3.max(tops);
  }

  get topics() {
    return this.series.map((s) => s.topic);
  }

  get dataByTopic(): {[key: string]: number}[] {
    return this.xs.map((x, i) => {
      return this.series.reduce((accum, s) => {
        accum[s.topic] = s.data[i];
        return accum;
      }, {});
    });
  }

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
  // TODO
  hasAnimation = false;
  background: string;
  margin = {top: 20, right: 50, bottom: 40, left: 50};
  colorSchema = new ColorSchema();
  legend = new LegendConfig();

  static from(config) {
    const _config = new BarChartConfig();
    Object.assign(_config, config);
    _config.colorSchema = ColorSchema.from(_config.colorSchema);
    _config.legend = LegendConfig.form(_config.legend);
    return _config;
  }

  static toJson(config: BarChartConfig) {
    return JSON.stringify(config, null, 2);
  }
}

export class BarChart implements ChartBase {
  data: BarChartData;
  config: BarChartConfig;
  element: HTMLElement;
  geo: GeoService;

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
    const { width, height, margin, legend } = this.config;
    this.geo = GeoService.fromMarginContainer({width, height}, margin);
    this.geo.insertLegend(legend);
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

    if (this.config.stack) {
      this.drawAxisStack();
      this.drawBarStack();
    } else {
      this.drawAxis();
      this.drawBarGrouped();
    }

    this.drawLegend();

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
        .attr('class', 'chart tdc-chart-bar');
    }

    this.container
      .attr('width', this.config.width)
      .attr('height', this.config.height);

    this.canvas = this.container.append('g')
      .attr('transform', this.geo.canvasTranslate);
  }

  initScale() {
    this.xScale = d3.scaleBand()
      .domain(this.data.xs)
      .rangeRound([0, this.geo.canvas.width])
      .paddingInner(0.5)
      .paddingOuter(0.2);

    if (this.config.stack) {
      this.yScale = d3.scaleLinear()
        .domain([0, this.data.stackTop])
        .rangeRound([this.geo.canvas.height, 0])
        .nice();
    } else {
      this.yScale = d3.scaleLinear()
        .domain([0, this.data.top])
        .rangeRound([this.geo.canvas.height, 0])
        .nice();
    }

    this.ordinalScale = d3.scaleOrdinal()
      .range(this.config.colorSchema.palette);

    this.stack = d3.stack();
  }

  drawAxis() {
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

    this.canvas.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.geo.canvas.height})`)
      .call(this.xAxis);

    this.canvas.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);
  }

  drawAxisStack() {
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);
    this.canvas.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.geo.canvas.height})`)
      .call(this.xAxis);

    this.canvas.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);
  }

  drawBarGrouped() {
    const xSubScale = d3.scaleBand().domain(this.data.topics).rangeRound([0, this.xScale.bandwidth()]);

    this.canvas.append('g')
      .selectAll('g')
      .data(this.data.xs)
      .enter()
      .append('g')
        .attr('transform', (x, i) => {
          return `translate(${this.xScale(x)}, 0)`;
        })
      .selectAll('rect')
      .data((x, i) => {
        return this.data.series.map((d) => {
          return {
            x: d.topic,
            y: d.data[i],
          };
        });
      })
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => xSubScale(d.x))
        .attr('y', (d) => this.yScale(d.y))
        .attr('width', xSubScale.bandwidth())
        .attr('height', (d) => this.geo.canvas.height - this.yScale(d.y))
        .attr('fill', (d, i) => this.ordinalScale(d.x));
  }

  drawBarStack() {
    const dataByTopic = this.data.dataByTopic;
    this.canvas.append('g')
      .selectAll('g')
      .data(d3.stack().keys(this.data.topics)(dataByTopic))
      .enter()
      .append('g')
        .attr('fill', (d) => {
          return this.ordinalScale(d.key);
        })
      .selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
        .attr('x', (d, i) => {
          const x = this.data.xs[i];
          return this.xScale(x);
        })
        .attr('y', (d, i) => {
          return this.yScale(d[1]);
        })
        .attr('width', this.xScale.bandwidth)
        .attr('height', (d, i) => {
          return this.yScale(d[0]) - this.yScale(d[1]);
        });
  }

  drawLegend() {
    const legend = new Legend(this.config.colorSchema, this.config.legend);
    const legendContainer = this.container.append('g').attr('transform', this.geo.legendTranslate);
    legend.draw(legendContainer, this.data.topics);
  }
}
