import {
  CircleShapeConfig,
  Circle,
} from '../shapes';
import { SelectionType } from '../chart-base';
import { Point2D } from '../helpers/transform-helper';

export class MarkerConfig {
  center: Point2D;
  // 目前只支持 double-circel
  // shape: string;
  color: string;
}

export type MarkerState = 'normal' | 'active';

export abstract class MarkerBase {
  state: MarkerState;
  color: string;
  abstract draw(container: SelectionType, config: MarkerConfig): this;
  abstract activate();
  abstract deactivate();
}

export class DoubleCircleMarker {
  node: SelectionType;
  className = 'marker-double-circle';
  outerCircle: Circle;
  innerCircle: Circle;
  state: MarkerState = 'normal';
  color: string;

  draw(container: SelectionType, config: MarkerConfig) {
    const {center, color} = config;
    const outerCircleConfig = CircleShapeConfig.create({center, radius: 2, fill: 'none', border: {width: 1, color}});
    const innerCircleConfig = CircleShapeConfig.create({center, radius: 2, fill: color});

    this.outerCircle = Circle.config(outerCircleConfig);
    this.innerCircle = Circle.config(innerCircleConfig);

    const sub = container.append('g').classed(this.className, true);
    this.outerCircle.draw(sub);
    this.innerCircle.draw(sub);

    this.node = sub;
    this.color = color;

    return this;
  }

  get isActive() {
    return this.state === 'active';
  }

  activate() {
    if (!this.isActive) {
      this.outerCircle.enlarge(8);
      this.innerCircle.enlarge(4);
      this.state = 'active';
    }
  }

  deactivate() {
    if (this.isActive) {
      this.outerCircle.enlarge(2);
      this.innerCircle.enlarge(2);
      this.state = 'normal';
    }
  }
}


export class MarkerFactory {
  static createMarker(container: SelectionType, config: MarkerConfig): MarkerBase {
    const doubleCircleMarker = new DoubleCircleMarker();
    doubleCircleMarker.draw(container, config);
    return doubleCircleMarker;
  }
}
