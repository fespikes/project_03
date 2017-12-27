import * as d3 from 'd3';

import {
  TransformHelper,
  Transform2D,
  Rect2D,
} from './helpers/transform-helper';
import { Margin, SelectionType } from './chart-base';
import { LegendConfig } from './legend';

/**
 * 负责chart container 内的各种transform操作
 */
export class GeoService {
  container2d: Rect2D;
  canvas2d: Rect2D;
  container: SelectionType;
  canvas: SelectionType;
  margin: Margin;

  get xAxis() {
    return this.canvas.select('.axis.x');
  }

  get yAxis() {
    return this.canvas.select('.axis.y');
  }

  get gridContainer() {
    return this.canvas.select('.grid-container');
  }

  get gridVertical() {
    return this.gridContainer.select('.grid-vertical');
  }

  get gridHorizontal() {
    return this.gridContainer.select('.grid-horizontal');
  }

  get legend() {
    return this.container.select('.legend');
  }

  get background() {
    return this.canvas.select('.background');
  }

  static fromMarginContainer(container: SelectionType, container2d: Rect2D, margin: Margin) {
    const geo = new GeoService();
    geo.container = container;
    geo.container2d = container2d;
    geo.margin = margin;


    const { width: cWidth, height: cHeight } = geo.container2d;
    // 计算canvas的宽高
    const width = cWidth - margin.left - margin.right;
    const height = cHeight - margin.top - margin.bottom;
    const canvasTransform = Transform2D.fromOffset(margin.left, margin.top);

    geo.placeCanvas({width, height}, canvasTransform);

    return geo;
  }

  clear() {
    this.container.remove();
  }

  placeCanvas(rect: Rect2D, transform2d = new Transform2D()) {
    this.canvas = this.container.append('g')
      .classed('canvas', true)
      .attr('transform', transform2d.toTranslate());
    this.canvas2d = rect;
    return this;
  }

  placeXAxis() {
    const { height } = this.canvas2d;
    const transform2d = Transform2D.fromOffset(0, height);
    this.canvas
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', transform2d.toTranslate());

    return this;
  }

  placeYAxis() {
    this.canvas
      .append('g')
      .attr('class', 'y axis');

    return this;
  }

  /**
   * 若插入legend，则要缩小canvas面积
   * @param legend
   */
  placeLegend(legend: LegendConfig) {
    // 平移canvas
    this.canvas2d.height = this.canvas2d.height - legend.areaHeight;
    const c2d = Transform2D.fromOffset(this.margin.left, this.margin.top + legend.areaHeight);
    this.canvas.attr('transform', c2d.toTranslate());

    let relativePosition;
    const { top, left, right } = this.margin;
    if (legend.align === 'right') {
      relativePosition = { top, right };
    } else {
      relativePosition = { top, left };
    }
    const t2d = TransformHelper.translateInContainer(this.container2d, legend.rect2D, relativePosition);
    this.container.append('g')
      .classed('legend', true)
      .attr('transform', t2d.toTranslate());

    return this;
  }

  placeBackground() {
    const { width, height } = this.canvas2d;
    this.canvas.append('rect')
      .classed('background', true)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent');

    return this;
  }

  placeGrid() {
    const gridContainer = this.canvas.append('g').attr('class', 'grid-container');
    gridContainer.append('g').attr('class', 'grid-vertical');
    gridContainer.append('g').attr('class', 'grid-horizontal');

    return this;
  }
}
