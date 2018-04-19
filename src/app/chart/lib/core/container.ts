import * as d3 from 'd3';
import { EventEmitter } from 'events';

import { SelectionType } from './chart-base';
import { Transform2D, Rect2D } from '../helpers/transform-helper';
import { Overlay } from './overlay';

export class ContainerMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;

  constructor(top = 0, right = 0, bottom = 0, left = 0) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }
}

export class ContainerDimension {
  width: number;
  height: number;
  // 表示是否可伸缩
  strict = false;

  constructor(width = 1, height = 1, strict = false) {
    this.width = width;
    this.height = height;
    this.strict = false;
  }

  resize(width: number, height: number) {
    if (this.strict) {
      return;
    }
    this.width = width;
    this.height = height;
    this.sanisize();
  }

  enlarge(wDelta: number, hDelta: number) {
    if (this.strict) {
      return;
    }
    this.width += wDelta;
    this.height += hDelta;
    this.sanisize();
  }

  sanisize() {
    this.width = this.width < 1 ? 1 : this.width;
    this.height = this.height < 1 ? 1 : this.height;
  }
}

export class Container {
  id: string;
  selection: SelectionType;
  transform = new Transform2D();
  dim = new ContainerDimension();
  innerDim = new ContainerDimension();
  parent: Container;
  children: Container[] = [];
  margin = new ContainerMargin();

  constructor(id: string, selection: SelectionType, parent?: Container) {
    this.id = id;
    this.selection = selection;
    this.parent = parent;
    this.selection.attr('id', this.id);
  }

  setMargin(margin: ContainerMargin) {
    Object.assign(this.margin, margin);
    this.calcInnerDim();
    return this;
  }

  resize({width, height}: {width?: number, height?: number}) {
    width = width || this.dim.width;
    height = height || this.dim.height;
    this.dim.resize(width, height);
    this.calcInnerDim();
    return this;
  }

  strict(strict: boolean) {
    this.dim.strict = strict;
    return this;
  }

  enlarge({wDelta, hDelta}: {wDelta?: number, hDelta?: number}) {
    wDelta = wDelta || 0;
    hDelta = hDelta || 0;
    this.dim.enlarge(wDelta, hDelta);
    this.calcInnerDim();
    return this;
  }

  calcInnerDim() {
    const { width, height } = this.dim;
    const { top, right, bottom, left } = this.margin;
    this.innerDim.resize(width - right - left, height - top - bottom);
  }

  translate(t: Transform2D, reset = false) {
    if (reset) {
      Object.assign(this.transform, t);
    } else {
      this.transform.translate(t);
    }
    this.applySelection();
    return this;
  }

  findChild(id: string) {
    return this.children.find((c) => c.id === id);
  }

  createChild(id: string, fullsize = false) {
    const childSelection = this.selection.append('g');
    const child = new Container(id, childSelection, this);
    this.children.push(child);
    if (fullsize) {
      child.dim = this.dim;
    }
    return child;
  }

  retrieveChild(id: string) {
    const child = this.findChild(id);
    if (child) {
      return child;
    }

    return this.createChild(id);
  }

  appendChild(child: Container) {
    this.children.push(child);
    child.parent = this;
  }

  applySelection() {
    this.selection.attr('transform', this.transform.toTranslate());
  }

  destroy() {
    this.children.forEach((c) => c.parent = null);
    this.children = null;
  }
}

export type FlexContainerDirection = 'row' | 'column';

// 参照flex布局
export class FlexContainer extends Container {
  direction: FlexContainerDirection = 'column';

  alignChildren(order: string[]) {
    this.children.sort((a, b) => {
      return order.indexOf(a.id) - order.indexOf(b.id);
    });
  }

  relayout() {
    // 不能被放缩的子节点: fixed-width
    const strictChildren = this.children.filter((child) => child.dim.strict);
    // 可放缩的子节点: flex: 1
    const flexChildren = this.children.filter((child) => !child.dim.strict);
    const { width, height } = this.innerDim;
    const { left, top } = this.margin;
    if (this.direction === 'row') {
      const childrenAmount = this.children.reduce((sum, child) => sum += child.dim.width, 0);
      const freeAmount = width - childrenAmount;
      const wDelta = freeAmount / flexChildren.length;
      flexChildren.forEach((child) => child.enlarge({wDelta}));
      const t2d = Transform2D.fromOffset(left, top);
      this.children.forEach((child) => {
        child.translate(t2d);
        t2d.translate(Transform2D.fromOffset(child.dim.width, 0));
      });
    } else {
      const childrenAmount = this.children.reduce((sum, child) => sum += child.dim.height, 0);
      const freeAmount = height - childrenAmount;
      const hDelta = freeAmount / flexChildren.length;
      flexChildren.forEach((child) => child.enlarge({hDelta}));
      const t2d = Transform2D.fromOffset(left, top);
      this.children.forEach((child) => {
        child.translate(t2d);
        t2d.translate(Transform2D.fromOffset(0, child.dim.height));
      });
    }
  }
}

export class CanvasContainer extends Container {
  mouseEvent = new EventEmitter();
  overlay: Overlay;

  constructor(id: string, selection: SelectionType, overlay: Overlay, parent?: Container) {
    super(id, selection, parent);
    this.overlay = overlay;
    ['mouseenter', 'mousemove', 'mouseleave'].forEach((event) => {
      overlay.on(event, () => {
        this.mouseEvent.emit(event, d3.mouse(this.selection.node()));
      });
    });
  }
}

export type AxisPlacement = 'top' | 'right' | 'bottom' | 'left';
export type AxisAlignment = 'vertical' | 'horizontal';

export class AxisContainer extends Container {
  placement: AxisPlacement;

  get align(): AxisAlignment {
    if (this.placement === 'left' || this.placement === 'right') {
      return 'vertical';
    } else {
      return 'horizontal';
    }
  }

  get range(): [number, number] {
    const { width, height } = this.dim;
    if (this.align === 'vertical') {
      // return [height, 0];
      return [0, height];
    } else {
      return [0, width];
    }
  }

  constructor(id: string, placement: AxisPlacement, parent: Container) {
    const selection = parent.selection.append('g');
    super(id, selection, parent);
    this.placement = placement;
  }

  relayout() {
    const { width, height } = this.parent.dim;
    // 布局自身, top和left不需要平移
    if (this.placement === 'right') {
      this.translate(Transform2D.fromOffset(width, 0));
    } else if (this.placement === 'bottom') {
      this.translate(Transform2D.fromOffset(0, height));
    }

    // 初始化尺寸
    if (this.align === 'vertical') {
      this.dim.resize(1, height);
    } else {
      this.dim.resize(width, 1);
    }
  }
}
