import { SelectionType } from '../chart-base';

import { CircleShapeConfig, Circle } from './circle';
import { PathShapeConfig, Path } from './path';

export class ShapeRender {

  static drawCircle(container: SelectionType, config: CircleShapeConfig) {
    const circle = Circle.config(config);
    circle.draw(container);
  }

  static drawPath(container: SelectionType, config: PathShapeConfig) {
    const path = Path.config(config);
    path.draw(container);
  }
}
