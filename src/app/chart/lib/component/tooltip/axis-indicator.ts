import { SelectionType, Container } from '../../core';
import { ShapeFactory } from '../../shapes';
import { Movable } from '../../shapes/movable';
import { Vector2D } from '../../helpers/transform-helper';
import { Grid } from '../grid';
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
  barWidth: number;
  transpose = false;

  get selection() {
    return this.grid.container.selection;
  }

  get gridHeight() {
    return this.grid.container.dim.height;
  }

  get gridWidth() {
    return this.grid.container.dim.width;
  }

  constructor(grid: Grid, type: AxisIndicatorType, barWidth?: number, transpose?: boolean) {
    this.grid = grid;
    this.type = type;
    this.barWidth = barWidth;
    if (transpose) {
      this.transpose = transpose;
    }
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
    this.indicator = ShapeFactory.drawMovableLine(this.selection, from, to, {});
  }

  drawBar() {
    if (this.transpose) {
      const base = {x: 0, y: - this.barWidth / 2};
      this.indicator = ShapeFactory.drawMovableRect(this.selection, base, this.barWidth,
        { width: this.gridWidth, color: 'rgba(6, 47, 91, .05)' });
    } else {
      const base = {x: - this.barWidth / 2, y: 0};
      this.indicator = ShapeFactory.drawMovableRect(this.selection, base, this.gridHeight,
        { width: this.barWidth, color: 'rgba(6, 47, 91, .05)' });
    }
  }

  show() {
    this.indicator.show();
  }

  hide() {
    this.indicator.hide();
  }

  move(x: number) {
    let vec;
    if (this.transpose) {
      vec = new Vector2D(0, 1);
    } else {
      vec = new Vector2D(1, 0);
    }
    this.indicator.move(vec, x - this.x);
    this.x = x;
  }
}
