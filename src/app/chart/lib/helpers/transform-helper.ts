import { SelectionType } from '../chart-base';

export class Rect2D {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class Point2D {
  x: number;
  y: number;
}

export class RelativePosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export class Transform2D {
  // x方向平移
  x = 0;

  // y方向平移
  y = 0;

  // 旋转
  r = 0;

  static fromOffset(xOffset, yOffset) {
    const transform = new Transform2D();
    transform.x = xOffset;
    transform.y = yOffset;
    return transform;
  }

  toTranslate() {
    return `translate(${this.x}, ${this.y})`;
  }
}

/**
 * 操作各种transform, 包括translate, rotate等
 */
export class TransformHelper {
  /**
   * 在container内平移child，relative为相对container的四个边距的距离
   * @param  {Rect2D} container
   * @param  {Rect2D} child
   * @param  {RelativePosition} relative
   */
  static translateInContainer(container: Rect2D, child: Rect2D, relative: RelativePosition) {
    let xOffset = 0;
    let yOffset = 0;
    if (relative.top) {
      yOffset = relative.top;
    } else if (relative.bottom) {
      yOffset = container.height - relative.bottom - child.height;
    }

    if (relative.left) {
      xOffset = relative.left;
    } else if (relative.right) {
      xOffset = container.width - relative.right - child.width;
    }

    return Transform2D.fromOffset(xOffset, yOffset);
  }
}
