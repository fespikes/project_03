import { mat3, vec3 } from 'gl-matrix';

import { SelectionType } from '../chart-base';
import { Point2D } from '../helpers/transform-helper';

export class Container {
  node: SelectionType;
  width: number;
  height: number;
  matrix = mat3.create();
  children: Container[];

  constructor(node: SelectionType) {
    this.node = node;
  }

  createChild() {
    const childNode = this.node.append('g');
    return new Container(childNode);
  }

  addChild(child: Container) {
    this.children.push(child);
  }

  translate(x: number, y: number) {
    const vec = [x, y, 1];
    mat3.translate(this.matrix, this.matrix, vec);
    this.applyToNode();
  }

  rotate(radian: number) {
    mat3.rotate(this.matrix, this.matrix, radian);
    this.applyToNode();
  }

  applyToNode() {
    // 旋转无效
    const vec = [0, 0, 1];
    const res = vec3.create();
    vec3.transformMat3(res, vec, this.matrix);
    const x = res[0];
    const y = res[1];
    this.node.attr('transform', `translate(${x}, ${y})`);
  }
}
