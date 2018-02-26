import { Point2D, Vector2D, Transform2D } from '../helpers/transform-helper';
import { SelectionType } from '../chart-base';

export class Movable {
  coord: Point2D;
  shape: SelectionType;
  transform = new Transform2D();

  move(vec: Vector2D, dist) {
    vec.normalize();
    const xdist = dist * vec.x;
    const ydist = dist * vec.y;

    this.transform.translate(Transform2D.fromOffset(xdist, ydist));

    this.shape.attr('transform', this.transform.toTranslate());
  }

  show() {
    this.shape.style('display', 'block');
  }

  hide() {
    this.shape.style('display', 'none');
  }

  clear() {
    if (this.shape) {
      this.shape.remove();
      this.shape = null;
    }
  }
}
