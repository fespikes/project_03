import { SelectionType } from '../core';
import { Point2D } from '../helpers/transform-helper';

export class Bar {
  selection: SelectionType;
  private fill: string;
  private p1: Point2D;
  private p2: Point2D;

  get shape() {
    return this.selection.select('rect');
  }

  get width() {
    return Math.abs(this.p1.x - this.p2.x);
  }

  get height() {
    return Math.abs(this.p1.y - this.p2.y);
  }

  /**
   * rect base 需取小的坐标值
   */
  get base() {
    const { p1, p2 } = this;
    const x = p1.x < p2.x ? p1.x : p2.x;
    const y = p1.y < p2.y ? p1.y : p2.y;
    return new Point2D(x, y);
  }

  get top() {
    const { p1, p2 } = this;
    const x = p1.x > p2.x ? p1.x : p2.x;
    const y = p1.y > p2.y ? p1.y : p2.y;
    return new Point2D(x, y);
  }

  constructor(selection: SelectionType) {
    this.selection = selection.append('g');
  }

  from(from: Point2D) {
    this.p1 = from;
    return this;
  }

  to(to: Point2D) {
    this.p2 = to;
    return this;
  }

  color(color: string) {
    this.fill = color;
    return this;
  }

  draw() {
    const { width, height } = this;
    const { x, y } = this.base;
    this.selection.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', this.fill)
    .attr('x', x)
    .attr('y', y);

    return this;
  }

  round(radius: number) {
    this.shape.attr('rx', radius)
    .attr('ry', radius);

    return this;
  }

  animate(horizontal = false) {
    if (!horizontal) {
      this.shape.attr('height', 0)
        .attr('y', this.top.y)
        .transition()
          .attr('y', this.base.y)
          .attr('height', this.height);
    } else {
      this.shape.attr('width', 0)
        .transition()
          .attr('width', this.width);
    }
  }
}
