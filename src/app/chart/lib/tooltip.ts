import * as d3 from 'd3';
import { ColorSchema } from './color-schema';
import { SelectionType } from 'app/chart/lib';

export class TooltipConfig {

}

export class TooltipItem {
  name: string | number;
  value: string | number;
  color: string;
}

export class Tooltip {
  tooltip: SelectionType;
  title: SelectionType;
  content: SelectionType;

  constructor() {}

  draw() {
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

    this.title = this.tooltip.append('div')
      .attr('class', 'chart-tooltip-title')
      .style('padding', '0 10px 0 0')
      .style('font-size', '14px')
      .style('font-weight', 'bold');

    this.content = this.tooltip.append('div')
    .attr('class', 'chart-tooltip-content');
  }

  show() {
    this.tooltip.style('display', 'block');
  }

  hide() {
    this.tooltip.style('display', 'none');
  }

  setContent(title: string, items: TooltipItem[]) {
    this.title.html(title);
    this.content.selectAll('.value').remove();
    this.content
    .selectAll('.value')
    .data(items)
    .enter()
    .append('div')
      .attr('class', 'value')
      .style('padding', '10 10px 0 0')
      .style('display', 'flex')
      .style('align-items', 'center')
      .html((d, i) => {
        return `
          <span class="chart-tooltip-marker" style="color:${d.color}">●</span>
          <span class="chart-tooltip-label">${d.name}: ${d.value}</span>
        `;
      });

    this.styleTooltip();
  }

  setPosition(x: number, y: number) {
    this.tooltip.style('top', `${y - 10}px`).style('left', `${x + 10}px`);
  }

  styleTooltip() {
    this.tooltip.selectAll('.chart-tooltip-marker')
      .style('font-size', '24px');

    this.tooltip.selectAll('.chart-tooltip-label')
      .style('white-space', 'nowrap')
      .style('font-size', '14px')
      .style('font-weight', 'bold');
  }
}
