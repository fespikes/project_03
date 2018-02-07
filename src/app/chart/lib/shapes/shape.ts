import { SelectionType } from '../chart-base';

import { CircleShapeConfig, Circle } from './circle';
import { LineShapeConfig, Line } from './line';
import { Point2D } from '../helpers/transform-helper';

export class ShapeFactory {

  static drawCircle(container: SelectionType, config: CircleShapeConfig) {
    const circle = Circle.config(config);
    circle.draw(container);
    return circle;
  }

  static drawLine(container: SelectionType, points: Point2D[], config: LineShapeConfig) {
    const line = Line.config(config);
    line.draw(container, points);
    return line;
  }
}
