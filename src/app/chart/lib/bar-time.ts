import * as d3 from 'd3';
import * as moment from 'moment';

import { GeoService } from './geo-service';
import { Grid } from './grid';
import { ChartBase } from './chart-base';
import {
  LinearAxis,
  LinearAxisConfig,
  TimeAxisConfig,
  TimeAxis,
  BandAxisConfig,
} from './axis';

export class BarPoint {
  x: Date;
  y: number;
}

export class BarTimeChartData {
  series: BarPoint[];

  static create(series: { x: string, y: number }[]) {
    const barTimeData = new BarTimeChartData();
    barTimeData.series = series.map(d => {
      return {
        x: moment(d.x).toDate(),
        y: d.y,
      };
    });
    return barTimeData;
  }

  get domain() {
    const length = this.series.length;
    const duration = moment(this.series[0].x).diff(this.series[1].x);
    const end = this.series[length - 1].x;
    const start = moment(this.series[0].x).subtract(duration).toDate();
    return [start, end];
  }
}

export class BarTimeChartConfig {
  width: number;
  height: number;
  xAxis: TimeAxisConfig = {
    ...new TimeAxisConfig(),
    tick: {
      useTimeInterval: true,
      count: 0,
      timeInterval: 'timeMinute',
      interval: 10,
      padding: 2,
      timeFormat: '%I:%M',
    },
  };
  yAxis = new LinearAxisConfig();
  hasAnimation = false;
  color = '#305ab5';
  background: string;
  margin = { top: 20, right: 50, bottom: 40, left: 50 };

  static from(config) {
    const _config = new BarTimeChartConfig();
    Object.assign(_config, config);
    return _config;
  }

  static toJson(config: BarTimeChartConfig) {
    return JSON.stringify(config, null, 2);
  }
}

export class BarTimeChart implements ChartBase {
  data: BarTimeChartData;
  config: BarTimeChartConfig;
  element: HTMLElement;
  geo: GeoService;
  xAxis: TimeAxis;
  yAxis: LinearAxis;

  private tooltip;

  constructor() {
  }

  setConfig(config: BarTimeChartConfig) {
    this.config = config;
    return this;
  }

  select(element: HTMLElement) {
    this.element = element;
    return this;
  }

  datum(data: BarTimeChartData) {
    this.data = data;
    return this;
  }

  draw() {
    this.initGeo();
    this.drawAxis();
    this.drawGrid();

    const bars = this.drawBar();
    this.appendAnimation(bars);
    this.appendTooltip(bars);

    this.drawTooltip();
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

    const { width, height, margin } = this.config;
    this.geo = GeoService.fromMarginContainer(rootContainer, { width, height }, margin);
    this.geo.placeGrid()
      .placeXAxis()
      .placeYAxis()
      .placeBackground();
  }

  drawAxis() {
    const { xAxis, yAxis } = this.config;
    const { width, height } = this.geo.canvas2d;

    this.xAxis = new TimeAxis(xAxis, this.geo.xAxis, 'bottom');
    this.yAxis = new LinearAxis(yAxis, this.geo.yAxis, 'left');

    const { series } = this.data;
    this.xAxis.draw(this.data.domain, [0, width]);
    this.yAxis.draw([0, d3.max(series.map(d => d.y))], [height, 0]);
  }

  drawGrid() {
    const { canvas2d, gridVertical } = this.geo;
    const gridRenderer = new Grid(gridVertical, canvas2d);
    const { grid, tick } = this.config.yAxis;

    gridRenderer.draw(grid, tick.count, this.yAxis.scale);
  }

  drawTooltip() {
    this.tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('width', 'auto')
      .style('z-index', '1000')
      .style('background', 'rgba(0,0,0,0.6)')
      .style('color', 'white')
      .style('padding', '10px')
      .style('border-radius', '5px')
      .style('display', 'none');

    // value
    this.tooltip.append('div')
      .attr('class', 'value')
      .style('padding', '10 10px 0 0')
      .style('display', 'flex')
      .style('align-items', 'center')
      .html((d, i) => {
        return `<span class="color-label" style="color:${this.config.color};font-size:24px">●</span> <span class="value-label"></span>`;
      });

      // date
      this.tooltip.append('div')
        .attr('class', 'date-label')
        .style('padding', '0 10px 0 0')
        .style('font-size', '14px')
        .style('font-weight', 'bold');
  }

  drawBar() {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;

    const dataSize = this.data.series.length;
    const bandwidth = (this.geo.canvas2d.width - dataSize * this.config.xAxis.tick.padding) / dataSize;
    return this.geo.canvas.selectAll('.bar')
      .data(this.data.series)
      .enter()
      .append('rect')
      .attr('class', '.bar')
      .attr('fill', this.config.color)
      .attr('x', (d, i) => xScale(d.x) - bandwidth / 2)
      .attr('width', (d, i) => bandwidth)
      .attr('y', (d) => yScale(0))
      .attr('height', 0)
      .attr('rx', bandwidth / 2.2);
  }

  appendAnimation(bars) {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;

    bars.transition()
      .delay((d, i) => i * 10)
      .attr('y', (d) => yScale(d.y))
      .attr('height', (d) => this.geo.canvas2d.height - yScale(d.y));
  }

  appendTooltip(bars) {
    bars.on('mouseover', () => this.tooltip.style('display', 'block'))
      .on('mouseout', () => this.tooltip.style('display', 'none'))
      .on('mousemove', (d, i) => {
        this.tooltip.style('top', (d3.event.pageY - 10) + 'px').style('left', (d3.event.pageX + 10) + 'px');
        this.tooltip.select('.value-label').html(d.y);
        this.tooltip.select('.date-label').html(moment(d.x).format('YYYY-MM-DD HH:mm'));
      });
  }

}
