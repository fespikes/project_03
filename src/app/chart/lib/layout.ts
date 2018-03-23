import { SelectionType, Margin } from './chart-base';
import { Overlay } from './overlay';
import { CanvasContainer, Container, FlexContainer, ContainerDimension, AxisContainer } from './container';
import { Transform2D, Rect2D } from './helpers/transform-helper';
import { LegendConfig } from './legend';

export class Layout {
  overlay: Overlay;
  root: FlexContainer;
  canvas: CanvasContainer;
  grid: Container;
  background: Container;
  legend: Container;
  xAxis: AxisContainer;
  yAxis: AxisContainer;

  constructor(overlay: Overlay) {
    this.overlay = overlay;
  }

  init(selection: SelectionType) {
    if (this.root) {
      this.root.destroy();
    }
    if (this.canvas) {
      this.canvas.destroy();
    }

    this.root = new FlexContainer('root', selection);
    this.canvas = new CanvasContainer('canvas', selection.append('g'), this.overlay);
    this.root.appendChild(this.canvas);
    // 后创建的container为前景
    this.background = this.canvas.createChild('background', true);
    this.grid = this.canvas.createChild('grid', true);
    this.xAxis = new AxisContainer('x-axis', 'bottom', this.canvas);
    this.yAxis = new AxisContainer('y-axis', 'left', this.canvas);
    this.canvas.appendChild(this.xAxis);
    this.canvas.appendChild(this.yAxis);

    return this;
  }

  layout(dim: Rect2D, margin: Margin, legend?: LegendConfig) {
    this.root.resize(dim).setMargin(margin);
    this.canvas.resize(this.root.innerDim);

    if (legend) {
      this.legend = this.root.createChild('legend');
      const { place } = legend;
      if (place === 'left' || place === 'right') {
        this.root.direction = 'row';
        this.legend.resize({
          width: legend.getContentWidth(),
          height: this.root.innerDim.height,
        })
        .strict(true);
      } else {
        this.root.direction = 'column';
        this.legend.resize({
          width: this.root.innerDim.width,
          height: legend.getContentWidth(),
        })
        .strict(true);
      }
      if (place === 'left' || place === 'top') {
        this.root.alignChildren(['legend', 'canvas']);
      } else {
        this.root.alignChildren(['canvas', 'legend']);
      }
    }

    this.root.relayout();
    this.xAxis.relayout();
    this.yAxis.relayout();
  }
}
