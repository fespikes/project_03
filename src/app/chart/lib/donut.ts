import * as d3 from 'd3';
import * as _ from 'lodash';

import { ChartBase } from './chart-base';
import { ColorSchema } from './color-schema';
import { Legend, LegendConfig } from './legend';
import { GeoService } from './geo-service';

export class DonutChart implements ChartBase {

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
    this.arc = d3.arc()
      .padRadius(50);

    this.pie = d3.pie()
      .sort(null)
      .padAngle(0.02)
      .value(function(d) {
        return d.value;
      });

    this.config.donutChartHolder.innerHTML = '';

    this.manipulateData();

    this.drawTire();

    return this;
  }

  manipulateData() {
    const donuts: any = this.data.donuts;
    const stack: any[] = [];
    let dataType = '';

    donuts.map((item: any) => {
      let sum = 0;
      const columns = [];

      _.each(item.parts, (part) => {
        sum += part.value;
        columns.push(part.title);
      });

      if ( sum !== item.sum ) {
        item.parts.unshift({
          'title': '',
          'value': item.sum - sum,
        });

        columns.unshift('blank');
        dataType = 'blank'; // TODO
      }

      stack.push({
        state: item.state,
        sum: (item.sum || sum),
        columns: columns,
        parts: item.parts,
        type: dataType,
      });
    });

    this.data.donuts = stack;
  }

  drawLegend(data, n) {
    const config = this.config;
    const legendStyle = this.config.legendStyle;
    let palette: string[] = [];
    let columns;

    if (data.type === 'blank') {
      palette = this.config.style.colorSchema.palette.slice(0, data.columns.length - 1);
      palette = palette.concat(['#edf2ff']).reverse();
      columns = data.columns.slice(1);
    } else {
      palette = this.config.style.colorSchema.palette;
      columns = data.columns;
    }

    const legend = d3.select(config.donutChartHolder).append('svg')
      .attr('class', 'legend')
      .attr('width', legendStyle.width)
      .attr('height', (legendStyle.rectHeight + 4) * data.columns.length )
      .style('position', 'absolute')
      .style('left', config.style.left + n * (config.style.left + legendStyle.width + 2 * config.style.maxRadius))
      .style('top', config.style.top)

    .selectAll('g')
      .data(columns.reverse())
    .enter().append('g')
      .attr('transform', function(d, i) {
        return 'translate(0,' + i * 20 + ')';
      });

    this.color = d3.scaleOrdinal().range(palette);

    this.color.domain(data.columns);

    legend.append('rect')
      .attr('width', legendStyle.rectWidth)
      .attr('height', legendStyle.rectHeight - 2)
      .style('fill', this.color);

    legend.append('text')
      .attr('x', legendStyle.rectWidth + 2)
      .attr('y', 9)
      .attr('dy', '.35em')
      .text(function(d) {
        return d !== 'blank' ? d : '';
      });
  }

  drawTire() {
    const me = this;
    const config = this.config;
    const style = config.style;
    const donuts = this.data.donuts;

    const radius = d3.scaleSqrt()
      .range([0, style.maxRadius]);
    radius.domain([0, d3.max(donuts, function(d) {
      return d.sum;
    })]);


    this.svg = d3.select(config.donutChartHolder).selectAll('.pie')
      .data(donuts)
      .enter().append('svg')
      .attr('class', 'pie')
      .each(function(d, idx) {

        me.drawLegend(d, idx);

        const r: any = 100; // radius(d.sum);

        const path: any = d3.select(this)
          .attr('width', r * 2)
          .attr('height', r * 2)
          .style('position', 'absolute')
          .style('left',
            config.style.left + config.legendStyle.width +
            idx * (config.style.left + config.legendStyle.width + 2 * config.style.maxRadius))
          .style('top', config.style.top - 20)
          .append('g')
          .attr('transform', 'translate(' + r + ',' + r + ')');

        path.selectAll('.arc')
          .data((da: any) => {
            return me.pie(da.parts);
          })
          .enter().append('path')
          .attr('class', 'arc')
          .attr('d', me.arc.outerRadius(r).innerRadius(r * 0.6))
          .style('fill', (da: any) => {
            return me.color(da.data.title);
          }).on('mouseover', dt => {
            me.drawCenterLabel(dt);
          });

      })
      .select('g');

      this.drawCenterLabel();
  }

  drawCenterLabel(part?) { console.log(part);
    if ( part && part.data.title === '' ) {
      return;
    }

    const p = Math.max(0, d3.precisionFixed(0.05) - 2),
      f = d3.format('.' + p + '%');

    this.svg.select('.label').remove();

    const label: any = this.svg.append('text')
      .attr('class', 'label');

    label.append('tspan')
      .attr('class', 'label-name')
      // .attr('x', '-20px')
      // .attr('dy', '100px')
      .text(function(d) {
        return d.state;
      }).style('position', 'absolute')
      .style('left', '-20px')
      .style('top', '100px');

    label.append('tspan')
      .attr('class', 'label-value')
      .attr('x', 0)
      .attr('dy', '1.1em')
      .text(function(d) {
        const value: any = d.parts[0]['value'];
        const formated = f((part ? part.value : value) / d.sum );
        return formated;
      });

  }

}

export class DonutChartConfig {

  donutChartHolder: any; // className of donut's container
  legend = new LegendConfig();

  style: any = {
    colorSchema: new ColorSchema(),
    thickness: 50,
    maxRadius: 100,
    width: 100,
    height: 100,
    left: 30,
    top: 30,
  };

  legendStyle: any = {
    width: 160,
    rectWidth: 18,
    rectHeight: 16,
  };

  static from(config) {
    const _config = new DonutChartConfig();
    Object.assign(_config, config);
    _config.style.colorSchema = ColorSchema.from(_config.style.colorSchema);
    _config.legend = LegendConfig.form(_config.legend);

    return _config;
  }
}

export class DonutChartData {

  donuts?: Array<Donut>;

  constructor(data: DonutChartData) {
    this.donuts = data.donuts;
  }

}

class Donut {
  state?: string;
  sum?: number;
  columns?: string[];
  parts?: Part[];
  type?: string;
}

class Part {
  title?: string;
  value?: number;
}
