import * as d3 from 'd3';
import { Selection } from 'd3' ;

import { Margin } from './chart-base';
import { Overlay } from './overlay';
import { Rect2D } from './helpers/transform-helper';
import { LegendConfig, Legend } from './legend';
import { Layout } from './layout';
import { ShapeFactory } from './shapes';
import { ColorSchema } from './color-schema';
import { AxisGridConfig } from './axis';
import { Grid } from './tooltip/grid';

export type Constructor<T> = new(...args: any[]) => T;

export class Chart {
  config: any;
  element: HTMLElement;
  data: any;
  layout: Layout;
  overlay: Overlay;

  setConfig(config: any) {
    this.config = config;
    return this;
  }

  select(element: HTMLElement) {
    this.element = element;
    return this;
  }

  datum(data: any) {
    this.data = data;
    return this;
  }

  init(dim: Rect2D, margin: Margin, legend?: LegendConfig) {
    if (this.overlay) {
      this.overlay.clear();
    }
    const wrapper = d3.select(this.element).append('div');

    const root = wrapper.append('svg')
    .attr('class', 'chart tdc-chart-line')
    .style('width', '100%')
    .style('height', '100%');

    const { width, height } = dim;
    this.overlay = new Overlay(wrapper, {width, height});
    this.layout = new Layout(this.overlay);
    this.layout.init(root);
    this.layout.layout(dim, margin, legend);
  }

  drawBackgroud() {
    if (this.config.background) {
      const { selection, dim: { width, height } } = this.layout.background;
      ShapeFactory.drawRect(selection, {x: 0, y: 0}, height, { width });
    }
  }

  drawLegend(config: LegendConfig, colorSchema: ColorSchema, topics: string[]) {
    if (!config.show) {
      return;
    }
    const legend = new Legend(colorSchema, config);
    legend.draw(this.layout.legend, topics);
  }
}

// export function mixinAxis<T extends Constructor<Chart>>(base: T) {
//   return class extends base {
//     grid: Grid;

//     drawAxis() {
//     }

//     drawGrid(gridConfig: AxisGridConfig, ticks: number[]) {
//       if (!this.grid) {
//         this.grid = new Grid(this.layout.grid);
//       }
//       this.grid.drawX(ticks, gridConfig);
//     }
//   };
// }
