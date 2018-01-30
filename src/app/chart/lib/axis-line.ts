import { SelectionType } from './chart-base';

export type AxisLineOrient = 'vertical' | 'horizontal';

export class AxisLine {
  container: SelectionType;
  line: SelectionType;
  orient: AxisLineOrient;

  constructor(container: SelectionType) {
    this.container = container;
  }

  draw(color: string, orient: AxisLineOrient, length: number) {
    this.orient = orient;
    if (this.line) {
      this.clear();
    }

    this.line = this.container.append('line')
    .classed('chart-axis-line', true)
    .classed(`chart-axis-line-${orient}`, true)
    .attr('stroke', color)
    .attr('stroke-width', 1)
    .style('display', 'none');

    if (orient === 'vertical') {
      this.line.attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', length);
    } else {
      this.line.attr('x1', 0)
      .attr('x2', length)
      .attr('y1', 0)
      .attr('y2', 0);
    }
  }

  clear() {
    this.container.selectAll('.chart-axis-line').remove();
    this.line = null;
  }

  show() {
    this.line.style('display', 'block');
  }

  hide() {
    this.line.style('display', 'none');
  }

  move(at: number) {
    if (!this.line) {
      return;
    }

    if (this.orient === 'vertical') {
      this.line.attr('x1', at)
      .attr('x2', at);
    } else {
      this.line.attr('y1', at)
      .attr('y2', at);
    }
  }
}
