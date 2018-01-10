import * as d3 from 'd3';

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
      .padAngle(0.02);

    this.config.donutChartHolder.innerHTML = '';

    this.manipulateData();

    this.drawTire();

    return this;
  }

  manipulateData() {
    const donuts: any = this.data.donuts;
    const stack: any[] = [];

    donuts.map((item: any) => {
      let dataType = '';
      let sum = 0;

      item.parts.forEach((part) => {
        sum += part;
      });

      if ( item.sum && sum !== item.sum ) {
        item.parts = item.parts.concat([item.sum - sum]);
        item.columns = item.columns.concat(['blank']);
        dataType = 'blank';
      }

      stack.push({
        state: item.state,
        sum: (item.sum || sum),
        columns: item.columns,
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
    const columns = data.columns;

    if (data.type === 'blank') {
      palette = this.config.style.colorSchema.palette.slice(0, data.columns.length - 1);
      palette = palette.concat(['#edf2ff']);
      data.columns.pop();
    } else {
      palette = this.config.style.colorSchema.palette;
    }

    this.color = d3.scaleOrdinal().range(palette);

    this.color.domain(columns);

    // due to the differences between: showLengend or not
    if (!config.showLeftLenend) {
      return;
    }

    const legend = d3.select(config.donutChartHolder).append('svg')
      .attr('class', 'legend')
      .attr('width', legendStyle.width)
      .attr('height', (legendStyle.rectHeight + 4) * data.columns.length )
      .style('position', 'absolute')
      .style('left', config.style.left + n * (config.style.left + legendStyle.width + 2 * config.style.maxRadius))
      .style('top', config.style.top)

    .selectAll('g')
      .data(data.columns)
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
      .text(function(d: any, num: number) {
        return d !== 'blank' ? d : '';
      });
  }

  drawTire() {
    const me = this;
    const config = this.config;
    const style = config.style;
    const donuts = this.data.donuts;

    this.svg = d3.select(config.donutChartHolder).selectAll('.pie')
      .data(donuts)
      .enter().append('svg')
      .attr('class', 'pie')
      .each(function(d: any, idx) {
        const currentSvg = this;

        if (d.columns) {
          me.drawLegend(d, idx);
        }

        const r: any = style.maxRadius; // radius(d.sum);

        // due to the differences between: showLengend or not
        const left = config.showLeftLenend ? (config.style.left + config.legendStyle.width +
            idx * (config.style.left + config.legendStyle.width + 2 * config.style.maxRadius)) :
        (config.style.left + idx * (config.style.left  + 2 * config.style.maxRadius));

        const path: any = d3.select(this)
          .attr('width', r * 2)
          .attr('height', r * 2)
          .style('position', 'absolute')
          .style('left', left)
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
          .style('fill', (da: any, n: number) => {
            return me.color(d.columns[n]);
          }).on('mouseover', dt => {
            me.drawCenterLabel(currentSvg, dt);
          }, this);

        me.drawCenterLabel(currentSvg);
      })
      .select('g');

  }

  drawCenterLabel(svg, part?) {
    const currentSvg = d3.select(svg);

    if ( part && part.data.title === '' ) {
      return;
    }

    const p = Math.max(0, d3.precisionFixed(0.05) - 2),
      f = d3.format('.' + p + '%');

    currentSvg.select('.label').remove();

    const label: any = currentSvg.select('g').append('text')
      .attr('class', 'label');

    label.append('tspan')
      .attr('class', 'label-value')
      .attr('x', '-1em')
      .attr('dy', 0)
      // .attr('dy', '1.1em')
      .text(function(d) {
        const value: any = d.parts[0];
        const formated = f((part ? part.data : value) / d.sum );
        return formated;
      });

    label.append('tspan')
      .attr('class', 'label-name')
      .attr('x', '-2em')
      // .attr('dy', '-.2em')
      .attr('dy', '1em')
      .style('fontSize', '10px')
      .text(function(d) {
        return d.type === 'blank' ? '' : d.state;
      });

  }

}

export class DonutChartConfig {

  donutChartHolder: any; // className of donut's container

  showLeftLenend = true;
  showBottomLabel = false;

  style: any = {
    colorSchema: new ColorSchema(),
    thickness: 50,
    maxRadius: 100,
    width: 100,
    height: 100,
    left: 30,
    top: 30,
  };

  legend = new LegendConfig();
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
  parts?: number[];
  type?: string;
}
