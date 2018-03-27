import * as d3 from 'd3';

import { ColorSchema } from '../component';
import { Rect2D, Transform2D } from '../helpers/transform-helper';
import { SelectionType } from '../core';
import { Container } from '../core';

export type LegendAlign = 'start' | 'end' | 'center';

export type LegendPlace = 'top' | 'bottom' | 'left' | 'right';

export type LegendOrientation = 'vertical' | 'horizontal';

export type LegendMarker = 'square' | 'circle' | 'line';

const defaultContentHeight = 30;
const defaultContentWidth = 80;

export class LegendConfig {
  /**
   * 是否显示legend。默认显示
   */
  show = true;

  /**
   * 相对于chart主体的位置
   */
  place: LegendPlace = 'top';

  /**
   * legend区域对齐。选项分别为 顶部top，中间center，底部end
   */
  align: LegendAlign = 'center';

  /**
   * legend 区域的宽度。若orient为horizontal, 则为高度；若orient为vertical，则为宽度
   */
  contentWidth: number | 'default' = 'default';

  /**
   * marker图形
   */
  marker: LegendMarker = 'square';

  static from(config) {
    const _config = new LegendConfig();
    Object.assign(_config, config);
    return _config;
  }

  get orient(): LegendOrientation {
    if (this.place === 'top' || this.place === 'bottom') {
      return 'horizontal';
    } else {
      return 'vertical';
    }
  }

  getContentWidth() {
    if (this.contentWidth !== 'default') {
      return this.contentWidth;
    }
    if (this.orient === 'horizontal') {
      return defaultContentHeight;
    } else {
      return defaultContentWidth;
    }
  }
}

export class Legend {
  container: Container;
  padding = 15;

  constructor(
    private colorSchema: ColorSchema,
    private config: LegendConfig,
  ) {}

  draw(container: Container, names: string[]) {
    this.container = container;
    const selection = this.container.selection.append('g');
    const legend = selection.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 14)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(names)
      .enter()
        .append('g')
        .classed('legend-item', true);

    this.drawMarkers(legend);

    legend.append('text')
      .attr('x', 20)
      .attr('y', 9)
      .attr('dy', '0.32rem')
      .text((text) => text);

    const items = selection.selectAll('.legend-item').nodes();

    legend.attr('transform', (text, i) => {
      return this.getItemsTranslate(items.slice(0, i));
    });

    const containerTranslate = this.getContainerTranslate(items, container.dim);
    selection.attr('transform', containerTranslate.toTranslate());
  }

  drawMarkers(legend: SelectionType) {
    const { marker } = this.config;
    if (marker === 'square') {
      legend.append('rect')
      .attr('x', 0)
      .attr('width', 16)
      .attr('height', 16)
      .attr('fill', (text, i) => this.colorSchema.getColor(i));
    } else if (marker === 'circle') {
      legend.append('circle')
      .attr('cx', 8)
      .attr('cy', 8)
      .attr('r', 8)
      .attr('fill', (text, i) => this.colorSchema.getColor(i));
    } else {
      legend.append('line')
      .attr('x1', 0)
      .attr('y1', 8)
      .attr('x2', 16)
      .attr('y2', 8)
      .style('stroke-width', '2px')
      .style('stroke', (text, i) => this.colorSchema.getColor(i));
    }
  }

  getItemsTranslate(items: any[]) {
    // 恒定的padding，应写进legend config中
    if (this.config.orient === 'horizontal') {
      const translateX = this.getItemsWidth(items);

      return `translate(${translateX}, 0)`;
    } else {
      const translateY = this.getItemsHeight(items);

      return `translate(0, ${translateY})`;
    }
  }

  getContainerTranslate(items: any[], legend2d: Rect2D) {
    let containerWidth;
    let containerHeight;
    const { orient, align } = this.config;
    if (orient === 'horizontal') {
      containerWidth = this.getItemsWidth(items, false);
      containerHeight = defaultContentHeight;
    } else {
      containerWidth = this.getItemsMaxWidth(items);
      containerHeight = this.getItemsHeight(items, false);
    }

    let translateX = (legend2d.width - containerWidth) / 2;
    let translateY = (legend2d.height - containerHeight) / 2;
    if (orient === 'horizontal') {
      if (align === 'start') {
        translateX = 0;
      } else if (align === 'end') {
        translateX = legend2d.width - containerWidth;
      }
    } else {
      if (align === 'start') {
        translateY = 0;
      } else if (align === 'end') {
        translateY = legend2d.height - containerHeight;
      }
    }

    return Transform2D.fromOffset(translateX, translateY);
  }

  getItemsMaxWidth(items: Element[]) {
    return items.reduce((max, item) => {
      const width = this.getItemWidth(item);
      return width > max ? width : max;
    }, 0);
  }

  getItemWidth(item: Element) {
    return item.getBoundingClientRect().width;
  }

  getItemHeight(item: Element) {
    return item.getBoundingClientRect().height;
  }

  getItemsWidth(items: Element[], trailingPadding = true) {
    const itemWidth = items.map((item) => this.getItemWidth(item))
    .reduce((accum, width) => accum + width + this.padding, 0);
    if (!trailingPadding) {
      return itemWidth - this.padding;
    } else {
      return itemWidth;
    }
  }

  getItemsHeight(items: Element[], trailingPadding = true) {
    const itemHeight = items.map((item) => this.getItemHeight(item))
    .reduce((accum, height) => accum + height + this.padding, 0);
    if (!trailingPadding) {
      return itemHeight - this.padding;
    } else {
      return itemHeight;
    }
  }
}
