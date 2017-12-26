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
import {
  LinearAxis,
  LinearAxisConfig,
  BandAxis,
  BandAxisConfig,
} from './axis';
import { Grid } from './grid';


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
  xAxis: BandAxis;
  yAxis: LinearAxis;

  private ordinalScale: ScaleOrdinal<any, any>;
  private stack: Stack<any, any, any>;

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
    this.initGeo();
    this.drawAxis();
    this.drawGrid();

    if (this.config.stack) {
      this.drawBarStack();
    } else {
      this.drawBarGrouped();
    }

    this.drawLegend();

    return this;
  }

  initGeo() {
    if (this.geo) {
      this.geo.clear();
    }
    const rootContainer = d3.select(this.element).append('svg')
    .attr('class', 'chart tdc-chart-bar')
    .style('width', '100%')
    .style('height', '100%');

    const { width, height, margin, legend } = this.config;
    this.geo = GeoService.fromMarginContainer(rootContainer, {width, height}, margin);
    this.geo.placeLegend(legend)
      .placeGrid()
      .placeXAxis()
      .placeYAxis()
      .placeBackground();
  }

  drawAxis() {
      const { xAxis, yAxis } = this.config;
      this.xAxis = new BandAxis(xAxis, this.geo.xAxis, 'bottom');
      this.yAxis = new LinearAxis(yAxis, this.geo.yAxis, 'left');

      const { width, height } = this.geo.canvas2d;
      let yTop;
      if (this.config.stack) {
        yTop = this.data.stackTop;
      } else {
        yTop = this.data.top;
      }
      this.xAxis.draw(this.data.xs, [0, width]);
      this.yAxis.draw([0, yTop], [height, 0]);

      this.ordinalScale = d3.scaleOrdinal()
        .range(this.config.colorSchema.palette);
  }

  drawGrid() {
    const { canvas2d, gridVertical } = this.geo;
    const gridRenderer = new Grid(gridVertical, canvas2d);
    const { grid, tick } = this.config.yAxis;

    gridRenderer.draw(grid, tick.count, this.yAxis.scale);
  }

  drawBarGrouped() {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;
    const xSubScale = d3.scaleBand().domain(this.data.topics).rangeRound([0, xScale.bandwidth()]);

    this.geo.canvas.append('g')
      .selectAll('g')
      .data(this.data.xs)
      .enter()
      .append('g')
        .attr('transform', (x, i) => {
          return `translate(${xScale(x)}, 0)`;
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
        .attr('y', (d) => yScale(d.y))
        .attr('width', xSubScale.bandwidth())
        .attr('height', (d) => this.geo.canvas2d.height - yScale(d.y))
        .attr('fill', (d, i) => this.ordinalScale(d.x));
  }

  drawBarStack() {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;
    const dataByTopic = this.data.dataByTopic;

    this.geo.canvas.append('g')
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
          return xScale(x);
        })
        .attr('y', (d, i) => {
          return yScale(d[1]);
        })
        .attr('width', xScale.bandwidth)
        .attr('height', (d, i) => {
          return yScale(d[0]) - yScale(d[1]);
        });
  }

  drawLegend() {
    const legend = new Legend(this.config.colorSchema, this.config.legend);
    legend.draw(this.geo.legend, this.data.topics);
  }
}
