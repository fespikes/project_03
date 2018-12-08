import * as d3 from 'd3';

import { ColorSchema } from './color-schema';
import { Rect2D, Transform2D } from './transform-helper';
import { SelectionType } from './chart-base';
import { Container } from './container';

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
  legend: SelectionType;


  constructor(
    private colorSchema: ColorSchema,
    private config: LegendConfig,
  ) {}

  draw(container: Container, names: string[]) {
    this.container = container;
    this.legend = this.container.selection.append('g').attr('class', 'legend');
    const legendItems = this.legend.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(names)
      .enter()
        .append('g')
        .classed('legend-item', true);

    this.drawMarkers(legendItems);

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 0)
      .attr('dy', '0.6rem')
      .text((text) => text);

    const trans = this.calcTranslate(container.dim);
    legendItems.attr('transform', (text, i) => trans[i]);

    const items = this.legend.selectAll('.legend-item').nodes();
    const containerTranslate = this.getContainerTranslate(items, container.dim);
    this.legend.attr('transform', containerTranslate.toTranslate());
  }

  calcTranslate(dim: {height: number, width: number}) {
    const {height, width} = dim;
    const {orient} = this.config;
    let trans;
    if (orient === 'horizontal') {
      trans = this.calcTranslateX(width);
    } else {
      trans = this.calcTranslateY(height);
    }

    return trans.reduce((flatMap: string[], _items) => {
      const transArr = _items.map((t) => {
        return `translate(${t.x}, ${t.y})`;
      });
      return flatMap.concat(transArr);
    }, []);
  }

  /**
   * 计算horizontal方向时各个item的平移，假如一行过长会自行折行
   * @param width 容器宽度
   */
  calcTranslateX(width: number) {
    const items = this.legend.selectAll('.legend-item').nodes();
    let accum = 0;
    const itemTransEnd = [];
    items.forEach((item) => {
      const itemWidth = this.getItemWidth(item as any);

      if (accum + itemWidth > width || itemTransEnd.length === 0) {
        itemTransEnd.push([{
          x: 0,
          y: itemTransEnd.length * 18,
        }]);
        accum = itemWidth + this.padding;
      } else {
        itemTransEnd[itemTransEnd.length - 1].push({
          x: accum,
          y: (itemTransEnd.length - 1) * 18,
        });
        accum += itemWidth + this.padding;
      }
    });
    return itemTransEnd;
  }

  /**
   * 计算vertical方向时各个item的平移，假如一列过长会自行换下一列(未重复测试) TODO: 测试
   * @param height 容器高度
   */
  calcTranslateY(height: number) {
    const items = this.legend.selectAll('.legend-item').nodes();
    let accum = 0;
    let maxWidth = 0;
    let columnStartX = 0;
    const itemTransEnd = [];
    items.forEach((item) => {
      const itemHeight = this.getItemHeight(item as any);
      const itemWidth = this.getItemWidth(item as any);

      if (accum + itemHeight > height || itemTransEnd.length === 0) {
        itemTransEnd.push([{
          x: columnStartX,
          y: 0,
        }]);
        columnStartX += maxWidth;
        maxWidth = 0;
      } else {
        itemTransEnd[itemTransEnd.length - 1].push({
          x: columnStartX,
          y: accum,
        });
      }
      accum += itemHeight + 2;

      if (itemWidth + this.padding > maxWidth) {
        maxWidth = itemWidth + this.padding;
      }
    });
    return itemTransEnd;
  }

  drawMarkers(legend: SelectionType) {
    const { marker } = this.config;
    if (marker === 'square') {
      legend.append('rect')
      .attr('x', 0)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', (text, i) => this.colorSchema.getColor(i));
    } else if (marker === 'circle') {
      legend.append('circle')
      .attr('cx', 6)
      .attr('cy', 6)
      .attr('r', 6)
      .attr('fill', (text, i) => this.colorSchema.getColor(i));
    } else {
      legend.append('line')
      .attr('x1', 0)
      .attr('y1', 6)
      .attr('x2', 12)
      .attr('y2', 6)
      .style('stroke-width', '2px')
      .style('stroke', (text, i) => this.colorSchema.getColor(i));
    }
  }

  getContainerTranslate(items: any[], legend2d: Rect2D) {
    const { orient, align } = this.config;
    const containerWidth = (this.legend.node() as any).getBoundingClientRect().width;
    const containerHeight = (this.legend.node() as any).getBoundingClientRect().height;

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

  getItemWidth(item: Element) {
    return item.getBoundingClientRect().width;
  }

  getItemHeight(item: Element) {
    return item.getBoundingClientRect().height;
  }
}
