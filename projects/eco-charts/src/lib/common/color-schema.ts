export class ColorSchema {
  palette = [
    '#336fd3',
    '#42c0df',
    '#9784eb',
    '#ffce00',
    '#f866b9',
    '#ffa71a',
    '#ff7f50',
    '#87cefa',
    '#da70d6',
    '#32cd32',
    '#6495ed',
    '#ba55d3',
    '#cd5c5c',
    '#40e0d0',
];
  filling = ['#edf2ff'];

  static from(config) {
    const _config = new ColorSchema();
    Object.assign(_config, config);
    return _config;
  }

  /**
   * 从colorSchma返回对应的颜色
   * @param number index
   */
  getColor(index: number) {
    const rounded = index % this.palette.length;
    return this.palette[rounded];
  }

  getOneWithFilling(index: number) {
    return [this.palette[index], this.filling[0]];
  }

  getAllPalette() {
    const { palette } = this;
    return palette;
  }
}
