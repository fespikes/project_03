export class Container2D {
  width: number;
  height: number;
}

export class RelativePosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export class Transform2D {
  xOffset: number;
  yOffset: number;

  static fromOffset(xOffset, yOffset) {
    const transform = new Transform2D();
    transform.xOffset = xOffset;
    transform.yOffset = yOffset;
    return transform;
  }

  toTranslate() {
    return `translate(${this.xOffset}, ${this.yOffset})`;
  }
}

/**
 * 操作各种transform, 包括translate, rotate等
 */
export class TransformHelper {
  /**
   * 在container内平移child，relative为相对container的四个边距的距离
   * @param  {Container2D} container
   * @param  {Container2D} child
   * @param  {RelativePosition} relative
   */
  static translateInContainer(container: Container2D, child: Container2D, relative: RelativePosition) {
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
