export class Rect2D {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  normalize() {
    const { x, y } = this;
    const x2 = x * x;
    const y2 = y * y;
    const sum = x2 + y2;
    this.x = Math.sqrt(x2 / sum);
    this.y = Math.sqrt(y2 / sum);
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

  static fromOffset(xOffset, yOffset) {
    const transform = new Transform2D();
    transform.x = xOffset;
    transform.y = yOffset;
    return transform;
  }

  translate(t: Transform2D) {
    this.x += t.x;
    this.y += t.y;
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
