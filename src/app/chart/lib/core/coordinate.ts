import { Point2D } from '../helpers/transform-helper';

/**
 * 简单的坐标轴抽象. 若用到更多矩阵变换，则考虑用gl-matrix等第三方矩阵库
 */
export class Coordinate {
  height: number;
  width: number;
  align: 'vertical' | 'horizontal' = 'vertical';
  apply = (p: Point2D) => {
    const { x, y } = p;
    return new Point2D(x, this.height - y);
  }

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  transpose() {
    this.align = 'horizontal';
    this.apply = (p: Point2D) => {
      const { x, y } = p;
      return new Point2D(y, this.height - x);
    };
  }
}

// TODO: 利用依赖注入
export namespace Coord {
  let _instance: Coordinate;
  export function create(width: number, height: number) {
    _instance = new Coordinate(width, height);
    return _instance;
  }
}
