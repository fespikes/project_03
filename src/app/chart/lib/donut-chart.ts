import * as d3 from 'd3';

import { ChartBase } from './chart-base';

class DonutChart implements ChartBase {

  data: DonutChartData;
  config: DonutChartConfig;
  element: HTMLElement;

  private color: any;
  private arc: any;
  private pie: any;
  private svg: any;

  constructor() {
    console.log('creat donutChart');
  }

  setConfig(config: DonutChartConfig ) {
    this.config = config;
    return this;
  }

  select(element: HTMLElement) {
    this.element = element;
    return this;
  }

  datum(data: DonutChartData) {
    this.data = data;
    return this;
  }

  draw() {
    const columns = this.data.columns;

    this.arc = d3.arc()
      .padRadius(50);

    this.pie = d3.pie()
      .sort(null)
      .padAngle(0.02)
      .value(function(d) {
        return d.population;
      });

    this.color = d3.scaleOrdinal()
      .range(this.config.style.colorRange);
    this.color.domain(columns);

    this.drawLegend();
    this.drawTire();

    return this;
  }

  drawLegend() {
    const config = this.config;
    const legendStyle = this.config.legendStyle;
    console.log(config.legendStyle.rectHeight * this.data.columns.length);

    const legend = d3.select(config.donutChartHolder).append('svg')
      .attr('class', 'legend')
      .attr('width', legendStyle.width)
      .attr('height', (legendStyle.rectHeight + 4) * this.data.columns.length )
      .attr('transform', 'matrix(1, 0, 0, 1, ' + 20 + ', 0)')

    .selectAll('g')
      .data(this.data.columns.reverse())
    .enter().append('g')
      .attr('transform', function(d, i) {
        return 'translate(0,' + i * 20 + ')';
      });

    legend.append('rect')
      .attr('width', legendStyle.rectWidth)
      .attr('height', legendStyle.rectHeight - 2)
      .style('fill', this.color);

    legend.append('text')
      .attr('x', legendStyle.rectWidth + 2)
      .attr('y', 9)
      .attr('dy', '.35em')
      .text(function(d) {
        return d;
      });
  }

  drawTire() {
    const me = this;
    const formatSum = d3.format('.1s');
    const config = this.config;
    const style = config.style;
    const donuts = this.data.donuts;

    const radius = d3.scaleSqrt()
      .range([0, style.maxRadius]);
    radius.domain([0, d3.max(donuts, function(d) {
      return d.sum;
    })]);


    const svg = d3.select(config.donutChartHolder).selectAll('.pie')
      .data(donuts.sort((a, b) => {
        return b.sum - a.sum;
      }))
      .enter().append('svg')
      .attr('class', 'pie')
      .each(function(d) {

        const r: any = radius(d.sum);
        const path: any = d3.select(this)
          .attr('width', r * 2)
          .attr('height', r * 2)
          .attr('transform', 'matrix(1, 0, 0, 1, ' + 50 + ', ' + 50 + ')')
          .append('g')
          .attr('transform', 'translate(' + r + ',' + r + ')');

        path.selectAll('.arc')
          .data((da: any) => {
            return me.pie(da.ages);
          })
          .enter().append('path')
          .attr('class', 'arc')
          .attr('d', me.arc.outerRadius(r).innerRadius(r * 0.6))
          .style('fill', (da: any) => {
            return me.color(da.data.age);
        });

      })
      .select('g');


    const label: any = svg.append('text')
      .attr('class', 'label');

    label.append('tspan')
      .attr('class', 'label-name')
      .attr('x', 0)
      .attr('dy', '-.2em')
      .text(function(d) {
        return d.state;
      });

    label.append('tspan')
      .attr('class', 'label-value')
      .attr('x', 0)
      .attr('dy', '1.1em')
      .text(function(d) {
        return formatSum(d.sum);
      });
  }

}

class DonutChartConfig {

  donutChartHolder: any; // className of donut's container

  style: any = {

    colorRange: [ // matching the columns in data
      '#98abc5',
      '#8a89a6',
      '#7b6888',
      '#6b486b',
      '#a05d56',
      '#d0743c',
      '#ff8c00',
    ],
    thickness: 50,
    maxRadius: 100,
    width: 100,
    height: 100,
  };

  legendStyle: any = {
    width: 150,
    rectWidth: 18,
    rectHeight: 16,
  };

}

class DonutChartData {

  columns?: Array<string>;

  donuts?: Array<any>;

  constructor(data: DonutChartData) {
    this.columns = data.columns;
    this.donuts = data.donuts;
  }

}

export {
  DonutChart,
  DonutChartData,
  DonutChartConfig,
};
