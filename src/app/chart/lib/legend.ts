import { ColorSchema } from './color-schema';
import { Container2D } from './helpers/transform-helper';
import { SelectionType } from './chart-base';

export class LegendConfig {
  align = 'left';
  width = 150;
  height = 30;
  areaHeight = 30;

  static form(config) {
    const _config = new LegendConfig();
    Object.assign(_config, config);
    return _config;
  }

  // TODO: inaccurate
  get container(): Container2D {
    const { width, height } = this;
    return {
      width,
      height,
    };
  }
}

export class Legend {
  constructor(
    private colorSchema: ColorSchema,
    private config: LegendConfig,
  ) {}

  getLegendTranslate(index: number) {
    const legendPerCol = Math.floor(this.config.areaHeight / this.config.height);
    const col = Math.floor(index / legendPerCol);
    const idx = index % legendPerCol;
    if (this.config.align === 'left') {
      return `translate(${col * this.config.width}, ${this.config.height * idx})`;
    } else {
      return `translate(${- col * this.config.width}, ${this.config.height * idx})`;
    }
  }

  draw(container: SelectionType, names: string[]) {
    const legend = container.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 14)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(names)
      .enter()
      .append('g')
      .attr('transform', (_, i) => {
        return this.getLegendTranslate(i);
      });

    legend.append('rect')
      .attr('x', 0)
      .attr('width', 16)
      .attr('height', 16)
      .attr('fill', (_, i) => this.colorSchema.getColor(i));

    legend.append('text')
      .attr('x', 20)
      .attr('y', 9)
      .attr('dy', '0.32rem')
      .text((name) => name);
  }
}
