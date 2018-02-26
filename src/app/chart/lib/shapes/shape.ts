import { SelectionType } from '../chart-base';

import { CircleShapeConfig, Circle } from './circle';
import { PathShapeConfig, Path } from './path';
import { LineShapeConfig, Line } from './line';
import { RectShapeConfig, Rect } from './rect';
import { Point2D } from '../helpers/transform-helper';

export class ShapeFactory {

  static drawCircle(selection: SelectionType, config: CircleShapeConfig) {
    const circle = Circle.config(config);
    circle.draw(selection);
    return circle;
  }

  static drawPath(selection: SelectionType, points: Point2D[], config: PathShapeConfig) {
    const path = Path.config(config);
    path.draw(selection, points);
    return path;
  }

  static drawLine(selection: SelectionType, from: Point2D, to: Point2D, config: LineShapeConfig) {
    const line = new Line(selection, config);
    line.draw(from, to);
    return line;
  }

  static drawRect(selection: SelectionType, base: Point2D, height: number, config: RectShapeConfig) {
    const rect = new Rect(selection, config);
    rect.draw(base, height);
    return rect;
  }
}
