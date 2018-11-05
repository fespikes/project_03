import * as d3 from 'd3';

import { ChartBase } from '../core';
import { ColorSchema, Legend, LegendConfig } from '../component';

export class DonutChart implements ChartBase {

  data: DonutChartData;
  config: DonutChartConfig;
  element: HTMLElement;

  private color: any;
  private arc: any;
  private pie: any;
  private svg: any;
  private shadowSize = 1.2;
  private palette: string[];

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
    this.addFilterDefs();
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
    const columns = data.columns;

    this.palette = config.style.colorSchema.getOneWithFilling(0);

    this.color = d3.scaleOrdinal().range(this.palette);

    this.color.domain(columns);

    // due to the differences between: showLengend or not
    if (!config.operateLegend.show) {
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
    let radius, r;

    if (config.widthGradient) {
      radius = d3.scaleSqrt().range([0, style.maxRadius]);
      radius.domain([0, d3.max(donuts, d => d.sum)]);
    }

    const donutWrapper: any = document.createElement('div');
    donutWrapper.style = 'height: ' + (style.maxRadius * 2 * me.shadowSize - 5) + 'px; display: flex; justify-content: space-evenly; ';
    const labelWrapper: any = document.createElement('div');
    labelWrapper.style = 'height:50px; display: flex; justify-content: space-evenly; ';
    config.donutChartHolder.appendChild(donutWrapper);
    config.donutChartHolder.appendChild(labelWrapper);

    this.svg = d3.select(donutWrapper).selectAll('.pie')
      .data(donuts)
      .enter().append('svg')
      .attr('class', 'pie')
      .each(function(d: any, idx) {
        const currentSvg = this;

        me.drawLegend(d, idx);
        r = config.widthGradient ? radius(d.sum) : style.maxRadius;

        // due to the differences between: showLengend or not
        const left = config.showLeftLegend ? (config.style.left + config.legendStyle.width +
            idx * (config.style.left + config.legendStyle.width + 2 * config.style.maxRadius)) :
        (config.style.left + idx * (config.style.left  + 2 * config.style.maxRadius));

        const path: any = d3.select(this)
          .attr('width', r * 2 * me.shadowSize)
          .attr('height', r * 2 * me.shadowSize)
          .append('g')
          .attr('transform', 'translate(' + r + ',' + r + ')')
          .attr('filter', 'url(#dropshadow)');

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
            if (config.percentage.byHover) {
              me.drawPercentage(currentSvg, dt);
            }
          }, this);

        me.drawPercentage(currentSvg);

        if (config.bottomLabel.show) {
          // me.drawBottomLabel(currentSvg, d, {
          me.drawBottomLabel(labelWrapper, d, {
            left: left,
            top: config.style.top - 20 + style.maxRadius * 2,
          });
        }
      })
      .select('g');
  }

  /**
  show the parts[0]'s data by default
  */
  drawPercentage(svg, part?) {
    if (!this.config.percentage.show) {
      return;
    }
    const currentSvg = d3.select(svg);
    const p = Math.max(0, d3.precisionFixed(0.05) - 2),
      f = d3.format('.' + p + '%');

    currentSvg.select('.label').remove();

    const label: any = currentSvg.select('g').append('text')
      .attr('class', 'label');

    label.append('tspan')
      .attr('class', 'label-value')
      .attr('x', '-0.8em')
      .attr('dy', 8)
      .text(function(d) {
        const dt = (part ? part.data : d.parts[0]) / d.sum;
        const result = f(dt);
        return dt.toString() === 'NaN' ? 0 : result;
      }).style('font-size', 20)
      .style('fill', this.palette[0]);
  }

  drawBottomLabel(box, donut, location) {
    const label: string = donut.state;
    const bottomLabel = this.config.bottomLabel;

    const span: any = document.createElement('span');
    const text: any = document.createTextNode(label);
    span.appendChild(text);
    span.style = 'width:' + this.config.style.thickness * 2 * this.shadowSize + 'px; height: 50px;' + location.top + 'line-height:'
      + (bottomLabel.height - 10) + 'px; text-indent: -20px; font-size:' +
      bottomLabel.size + 'px; text-align: center; font-size:' + bottomLabel.size;
    box.appendChild(span);
  }

  addFilterDefs() {
    const filter = `<svg style="position: absolute">
      <defs>
        <filter id="dropshadow" height="${this.shadowSize}">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="2" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>`;
    this.config.donutChartHolder.innerHTML = filter;
  }

}

export class DonutChartConfig {

  donutChartHolder: any; // className of donut's container

  showLeftLegend = false;  // show legend on left
  showRightLegend = false;  // show legend on right
  operateLegend = {
    show: false,
    position: 'left',
  };

  percentage = {
    show: true,
    size: 21,
    byHover: false,
  };

  bottomLabel = {
    show: true,  // show the label on bottom
    size: 13,
    height: 50,
  };

  widthGradient = false;  // if show tire width with gradient

  style: any = {
    colorSchema: new ColorSchema(),
    thickness: 50,
    maxRadius: 50,
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
    _config.legend = LegendConfig.from(_config.legend);

    return _config;
  }
}

export class DonutChartData {

  donuts?: Array<Donut>;
  constructor(data: DonutChartData) {
    this.donuts = data.donuts;
  }
}

export class Donut {
  state?: string;
  sum?: number;
  columns?: string[];
  parts?: number[];
  type?: string;
}
