import * as d3 from 'd3';

import { SelectionType, Container, ContainerMargin } from '../../core';
import { Rect2D } from '../../helpers/transform-helper';
import { ColorSchema } from '../color-schema';
import { TooltipEvent } from './tooltip-event';

export class TooltipItem {
  name: string | number;
  value: string | number;
  color: string;
}

export class Tooltip {
  overlay: SelectionType;
  tooltip: SelectionType;
  title: SelectionType;
  content: SelectionType;
  containerDim: Rect2D;
  /**
   * tootip位置与数据的间距
   */
  gap = 10;

  get tooltipDim() {
    const rect = this.tooltip.node().getBoundingClientRect();
    const { width, height } = rect;
    return new Rect2D(width, height);
  }

  constructor(overlay: SelectionType) {
    this.overlay = overlay;
  }

  subscribe(event: TooltipEvent) {
    event.on('mousemove', ([x, y]) => {
      const [cx, cy] = this.confinePosition(x, y);
      this.show();
      this.move(cx, cy);
    });

    event.on('mouseleave', () => {
      this.hide();
    });

    event.on('tooltip', ({title, items}) => {
      this.setContent(title, items);
    });

    return this;
  }

  boundary(rect: Rect2D) {
    this.containerDim = rect;
    return this;
  }

  draw() {
    this.tooltip = this.overlay
      .append('div')
      .style('position', 'absolute')
      .style('width', 'auto')
      .style('z-index', '1000')
      .style('background', 'rgba(0,0,0,0.6)')
      .style('color', 'white')
      .style('padding', '10px')
      .style('border-radius', '5px')
      .style('display', 'none')
      .style('transition', `
        visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1),
        left 0.3s cubic-bezier(0.23, 1, 0.32, 1),
        top 0.3s cubic-bezier(0.23, 1, 0.32, 1)
      `);

    this.title = this.tooltip.append('div')
      .attr('class', 'chart-tooltip-title')
      .style('font-size', '13px')
      .style('font-weight', 'bold');

    this.content = this.tooltip.append('div')
    .attr('class', 'chart-tooltip-content');

    return this;
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
      .style('padding', '3px 0 0 0')
      .style('display', 'flex')
      .style('align-items', 'center')
      .html((d, i) => {
        return `
          <span class="chart-tooltip-marker" style="color:${d.color};margin-right:2px">●</span>
          <span class="chart-tooltip-label">${d.name}: ${d.value}</span>
        `;
      });

    this.styleTooltip();
  }

  move(x: number, y: number) {
    this.tooltip.style('top', `${y}px`).style('left', `${x}px`);
  }

  getOverlayMousePosition() {
    return d3.mouse(this.overlay.node());
  }

  confinePosition(x: number, y: number) {
    // 计算overlay相对于container的位置
    const [ox, oy] = this.getOverlayMousePosition();
    const marginLeft = ox - x;
    const marginTop = oy - y;

    // 计算是否在规定的container里是否越界
    const { width, height } = this.tooltipDim;
    const { width: boundaryWidth, height: boundaryHeight } = this.containerDim;
    if (x + width > boundaryWidth) {
      x = x - width - this.gap;
    } else {
      x = x + this.gap;
    }

    if (y + height > boundaryHeight) {
      y = y - height - 2 * this.gap;
    } else {
      y = y + this.gap;
    }

    return [x + marginLeft, y + marginTop];
  }

  styleTooltip() {
    this.tooltip.selectAll('.chart-tooltip-marker')
      .style('font-size', '16px');

    this.tooltip.selectAll('.chart-tooltip-label')
      .style('white-space', 'nowrap')
      .style('font-size', '12px')
      .style('font-weight', 'bold');
  }
}
