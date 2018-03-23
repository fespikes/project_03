import * as d3 from 'd3';
import {
  ScaleLinear,
  ScaleBand,
  ScaleOrdinal,
  Stack,
  Axis,
  Selection,
} from 'd3';

import { ChartBase, SelectionType } from '../chart-base';
import { ColorSchema } from '../color-schema';
import { Legend, LegendConfig } from '../legend';
import {
  LinearAxis,
  LinearAxisConfig,
  BandAxis,
  BandAxisConfig,
} from '../axis';
import { Grid } from '../tooltip/grid';
import { Chart } from '../chart';
import { TooltipBundleCls, TooltipItem, TooltipEvent, Tooltip, AxisIndicator } from '../tooltip';
import { Rect2D, Point2D } from '../helpers/transform-helper';


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
  background: string;
  margin = {top: 20, right: 50, bottom: 40, left: 50};
  colorSchema = new ColorSchema();
  legend = new LegendConfig();

  static from(config) {
    const _config = new BarChartConfig();
    Object.assign(_config, config);
    _config.colorSchema = ColorSchema.from(_config.colorSchema);
    _config.legend = LegendConfig.from(_config.legend);
    return _config;
  }

  static toJson(config: BarChartConfig) {
    return JSON.stringify(config, null, 2);
  }
}

class TooltipBundle extends TooltipBundleCls {
  constructor(x: number, title: string) {
    super();
    this.x = x;
    this.title = title;
    this.items = [];
  }

  distance(x: number, y: number) {
    return Math.abs(this.x - x);
  }
}

export class BarChart extends Chart {
  data: BarChartData;
  config: BarChartConfig;
  element: HTMLElement;
  xAxis: BandAxis;
  yAxis: LinearAxis;

  private ordinalScale: ScaleOrdinal<any, any>;
  private stack: Stack<any, any, any>;
  grid: Grid;
  tooltip: Tooltip;
  axisIndicator: AxisIndicator;

  draw() {
    const { width, height, margin, legend, colorSchema } = this.config;
    this.init({width, height}, margin, legend);

    this.drawAxis();
    this.drawGrid();

    if (this.config.stack) {
      const bars = this.drawBarStack();
      this.appendAnimationStack(bars);
    } else {
      const bars = this.drawBarGrouped();
      this.appendAnimationGrouped(bars);
    }

    this.drawLegend(legend, colorSchema, this.data.topics);

    this.initTooltip();

    return this;
  }

  initTooltip() {
    const { scale } = this.xAxis;
    const objectMap: {[key: string]: TooltipBundleCls} = {};

    this.data.series.forEach((series, i) => {
      const topic = series.topic;
      const color = this.config.colorSchema.getColor(i);
      series.data.forEach((data, idx) => {
        const title = this.data.xs[idx];
        if (!objectMap[title]) {
          const x = this.xAxis.center(title);
          objectMap[title] = new TooltipBundle(x, title)  ;
        }
        objectMap[title].items.push({
          name: topic,
          value: data,
          color,
        });
      });
    });
    const objects = Object.keys(objectMap).map((key) => objectMap[key]);

    const tooltipEvent = new TooltipEvent(this.layout.canvas, objects);
    this.tooltip = new Tooltip(this.overlay.container).draw().subscribe(tooltipEvent);
    const bandwidth = this.xAxis.scale.bandwidth();
    this.axisIndicator = new AxisIndicator(this.grid, 'bar', bandwidth + 20).draw().subscribe(tooltipEvent);
  }

  drawAxis() {
      let yTop;
      if (this.config.stack) {
        yTop = this.data.stackTop;
      } else {
        yTop = this.data.top;
      }
      const { xAxis, yAxis } = this.config;
      const { xAxis: xContainer, yAxis: yContainer } = this.layout;
      this.xAxis = BandAxis.create(xAxis, xContainer, this.data.xs);
      this.yAxis = LinearAxis.create(yAxis, yContainer, [0, yTop]);

      this.ordinalScale = d3.scaleOrdinal()
        .range(this.config.colorSchema.palette);
  }

  drawGrid() {
    const { yAxis } = this.config;
    this.grid = new Grid(this.layout.grid);
    this.grid.drawY(this.yAxis.ticks(), yAxis.grid);
  }

  drawBarGrouped() {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;
    const xSubScale = d3.scaleBand().domain(this.data.topics).rangeRound([0, xScale.bandwidth()]);

    return this.layout.canvas.selection.append('g')
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
            xs: this.data.xs[i],
            xIndex: i,
          };
        });
      })
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('fill', (d, i) => this.ordinalScale(d.x))
        .attr('x', (d) => xSubScale(d.x))
        .attr('width', xSubScale.bandwidth())
        .attr('y', (d) => yScale(0))
        .attr('height', 0);
  }

  drawBarStack() {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;
    const dataByTopic = this.data.dataByTopic;

    return this.layout.canvas.selection.append('g')
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
      .attr('y', this.layout.canvas.dim.height)
      .attr('width', xScale.bandwidth)
      .attr('height', 0);
  }

  appendAnimationGrouped(bars) {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;
    bars.transition()
      .delay((d, i) => i * 10)
      .attr('y', (d) => yScale(d.y))
      .attr('height', (d) => this.layout.canvas.dim.height - yScale(d.y));
  }

  appendAnimationStack(bars) {
    const { scale: xScale } = this.xAxis;
    const { scale: yScale } = this.yAxis;
    bars.transition()
      .delay((d, i) => i * 10)
      .attr('y', (d, i) => {
        return yScale(d[1]);
      })
      .attr('height', (d, i) => {
        return yScale(d[0]) - yScale(d[1]);
      });
  }
}
