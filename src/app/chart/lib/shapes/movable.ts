import { Point2D, Vector2D, Transform2D } from '../helpers/transform-helper';
import { SelectionType, Constructor } from '../core';

export interface Movable {
  coord: Point2D;
  shape: SelectionType;
  transform: Transform2D;

  move(vec: Vector2D, dist): void;
  show();
  hide();
  clear();
}

export class BaseShape {
  shape: SelectionType;
}

export function mixinMovable<T extends Constructor<BaseShape>>(base: T) {
  return class extends base implements Movable {
    coord: Point2D;
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
  };
}
