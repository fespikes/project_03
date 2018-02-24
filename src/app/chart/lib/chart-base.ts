import * as d3 from 'd3';
import { Selection } from 'd3' ;

import { Overlay } from './overlay';
import { Transform2D, Rect2D } from './helpers/transform-helper';
import { LegendConfig } from './legend';
import { EventEmitter } from 'events';

export abstract class ChartBase {

  abstract setConfig(config): ChartBase;

  abstract select(element: HTMLElement): ChartBase;

  abstract datum(datum): ChartBase;

  abstract draw(): ChartBase;
}

export type SelectionType = Selection<any, any, any, any>;

export class Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}


export class Container {
  id: string;
  selection: SelectionType;
  transform = new Transform2D();
  dim: Rect2D;
  parent: Container;
  children: Container[] = [];

  constructor(id: string, selection: SelectionType, parent?: Container) {
    this.id = id;
    this.selection = selection;
    this.parent = parent;
    this.selection.attr('id', this.id);
  }

  setDim(dim: Rect2D) {
    this.dim = dim;
    return this;
  }

  translate(t: Transform2D) {
    this.transform.translate(t);
    this.applySelection();
    return this;
  }

  findChild(id: string) {
    return this.children.find((c) => c.id === id);
  }

  createChild(id: string) {
    const childSelection = this.selection.append('g');
    const child = new Container(id, childSelection, this);
    this.children.push(child);
    return child;
  }

  retrieveChild(id: string) {
    const child = this.findChild(id);
    if (child) {
      return child;
    }

    return this.createChild(id);
  }

  applySelection() {
    this.selection.attr('transform', this.transform.toTranslate());
  }

  destroy() {
    this.children.forEach((c) => c.parent = null);
    this.children = null;
  }
}

export class InteractiveContainer extends Container {
  mouseEvent = new EventEmitter();
  overlay: Overlay;

  constructor(id: string, selection: SelectionType, overlay: Overlay, parent?: Container) {
    super(id, selection, parent);
    this.overlay = overlay;
    ['mouseenter', 'mousemove', 'mouseleave'].forEach((event) => {
      overlay.on(event, () => {
        this.mouseEvent.emit(event, d3.mouse(this.selection.node()));
      });
    });
  }

  createChild(id: string) {
    const childSelection = this.selection.append('g');
    const child = new InteractiveContainer(id, childSelection, this.overlay, this);
    this.children.push(child);
    return child;
  }
}

export class ChartLayout {
  overlay: Overlay;
  root: InteractiveContainer;
  canvas: InteractiveContainer;
  map: {[key: string]: Container};

  get xAxis() {
    let x = this.canvas.findChild('x-axis');
    if (x) {
      return x;
    } else {
      x = this.canvas.createChild('x-axis');
      x.translate(Transform2D.fromOffset(0, this.canvas.dim.height));
      return x;
    }
  }

  get yAxis() {
    return this.canvas.retrieveChild('y-axis');
  }

  get legend() {
    return this.root.retrieveChild('legend');
  }

  get gridVertical() {
    return this.canvas.retrieveChild('grid-vertical');
  }

  get gridHorizontal() {
    return this.canvas.retrieveChild('grid-horizontal');
  }

  get background() {
    return this.canvas.retrieveChild('backgroud');
  }

  get marker() {
    return this.canvas.retrieveChild('marker-container');
  }

  constructor(overlay: Overlay) {
    this.overlay = overlay;
  }

  init(selection: SelectionType) {
    if (this.root) {
      this.root.destroy();
    }
    if (this.canvas) {
      this.canvas.destroy();
    }

    this.root = new InteractiveContainer('root', selection, this.overlay);
    this.canvas = this.root.createChild('canvas');

    return this;
  }

  layout(dim: Rect2D, margin: Margin, legend?: LegendConfig) {
    this.root.setDim(dim);

    if (legend) {
      this.layoutLegend(margin, legend);
    } else {
      const { width: cWidth, height: cHeight } = dim;
      // 计算canvas的宽高
      const width = cWidth - margin.left - margin.right;
      const height = cHeight - margin.top - margin.bottom;
      const canvasTransform = Transform2D.fromOffset(margin.left, margin.top);
      this.canvas.setDim({width, height})
        .translate(canvasTransform);
    }
  }

  layoutLegend(margin: Margin, legend: LegendConfig) {
    const legendContentWidth = legend.getContentWidth();
    const { place } = legend;
    const { top: marginTop, left: marginLeft, right: marginRight, bottom: marginBottom } = margin;
    let canvasDim;
    // 平移canvas
    {
      let c2d, canvasWidth, canvasHeight;
      const { width: cWidth, height: cHeight } = this.root.dim;
      if (place === 'left' || place === 'right') {
        canvasWidth = cWidth - margin.left - margin.right - legendContentWidth;
        canvasHeight = cHeight - margin.top - margin.bottom;
      } else {
        canvasWidth = cWidth - margin.left - margin.right;
        canvasHeight = cHeight - margin.top - margin.bottom - legendContentWidth;
      }

      c2d = Transform2D.fromOffset(marginLeft, marginTop);
      if (place === 'left') {
        c2d = Transform2D.fromOffset(marginLeft + legendContentWidth, marginTop);
      } else if (place === 'top') {
        c2d = Transform2D.fromOffset(marginLeft, marginTop + legendContentWidth);
      }

      canvasDim = {width: canvasWidth, height: canvasHeight};
      this.canvas.setDim(canvasDim).translate(c2d);
    }

    {
      const extraTranslate = 30;
      let t2d = Transform2D.fromOffset(marginLeft, marginTop);
      if (place === 'right') {
        t2d = Transform2D.fromOffset(marginLeft + extraTranslate + canvasDim.width, marginTop);
      } else if (place === 'bottom') {
        t2d = Transform2D.fromOffset(marginLeft, marginTop + canvasDim.height + extraTranslate);
      }

      let legendDim;
      if (place === 'left' || place === 'right') {
        legendDim = new Rect2D(legendContentWidth, canvasDim.height);
      } else {
        legendDim = new Rect2D(canvasDim.width, legendContentWidth);
      }

      this.root.createChild('legend').setDim(legendDim).translate(t2d);
    }
  }
}

export class Chart {
  config: any;
  element: HTMLElement;
  data: any;
  layout: ChartLayout;
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

    const { width, height } = this.config;
    this.overlay = new Overlay(wrapper, {width, height});
    this.layout = new ChartLayout(this.overlay);
    this.layout.init(root);
    this.layout.layout(dim, margin, legend);
  }
}
