import {
  TransformHelper,
  Transform2D,
  Container2D,
} from './helpers/transform-helper';
import { Margin } from './chart-base';
import { LegendConfig } from './legend';

/**
 * 负责chart container 内的各种transform操作
 */
export class GeoService {
  container: Container2D;
  canvas: Container2D;
  legend: LegendConfig;
  margin: Margin;

  static fromMarginContainer(container: Container2D, margin: Margin) {
    const geo = new GeoService();
    geo.container = container;
    geo.margin = margin;

    // 计算canvas的宽高
    const width = container.width - margin.left - margin.right;
    const height = container.height - margin.top - margin.bottom;
    geo.canvas = {
      width,
      height,
    };
    return geo;
  }

  /**
   * 若插入legend，则要缩小canvas面积
   * @param legend
   */
  insertLegend(legend: LegendConfig) {
    this.legend = legend;
    this.canvas.height = this.canvas.height - this.legend.areaHeight;
  }

  get canvasTranslate() {
    const t2d = TransformHelper.translateInContainer(this.container, this.canvas, {
      left: this.margin.left,
      bottom: this.margin.bottom,
    });
    return t2d.toTranslate();
  }

  get legendTranslate() {
    let relativePosition;
    const { top, left, right } = this.margin;
    if (this.legend.align === 'right') {
      relativePosition = { top, right };
    } else {
      relativePosition = { top, left };
    }
    const t2d = TransformHelper.translateInContainer(this.container, this.legend.container, relativePosition);
    return t2d.toTranslate();
  }
}
