import { SelectionType } from '../chart-base';
import { Container } from '../container';
import { ShapeFactory } from '../shapes';
import { Movable } from '../shapes/movable';
import { Vector2D } from '../helpers/transform-helper';
import { Grid } from './grid';
import { TooltipEvent } from './tooltip-event';

export type AxisIndicatorOrient = 'vertical' | 'horizontal';

export type AxisIndicatorType = 'line' | 'bar';

export class AxisIndicatorConfig {
  type: AxisIndicatorType;
}

export class AxisIndicator {
  grid: Grid;
  type: AxisIndicatorType;
  indicator: Movable;
  x = 0;

  get selection() {
    return this.grid.container.selection;
  }

  get gridHeight() {
    return this.grid.container.dim.height;
  }

  get barWidth() {
    return this.grid.container.dim.width / this.grid.xTicks.length;
  }

  constructor(grid: Grid, type: AxisIndicatorType) {
    this.grid = grid;
    this.type = type;
  }

  subscribe(event: TooltipEvent) {
    event.on('axismove', (x) => {
      this.show();
      this.move(x);
    });

    event.on('mouseleave', () => {
      this.hide();
    });

    return this;
  }

  draw() {
    if (this.indicator) {
      this.indicator.clear();
    }

    if (this.type === 'line') {
      this.drawLine();
    } else {
      this.drawBar();
    }
    this.hide();

    return this;
  }

  drawLine() {
    const from = {x: 0, y: 0};
    const to = {x: 0, y: this.gridHeight};
    this.indicator = ShapeFactory.drawLine(this.selection, from, to, {});
  }

  drawBar() {
    const base = {x: 0, y: 0};
    this.indicator = ShapeFactory.drawRect(this.selection, base, this.gridHeight, { width: this.barWidth });
  }

  show() {
    this.indicator.show();
  }

  hide() {
    this.indicator.hide();
  }

  move(x: number) {
    const vec = new Vector2D(1, 0);
    this.indicator.move(vec, x - this.x);
    this.x = x;
  }

  // TODO
  moveTick(x: number) {

  }
}
