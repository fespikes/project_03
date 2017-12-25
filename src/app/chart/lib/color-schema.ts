export class ColorSchema {
  palette = ['#336fd3', '#42c0df', '#9784eb', '#39c2c9', '#39c2c9', '#ffce00', '#ffa71a', '#f866b9'];

  static from(config) {
    const _config = new ColorSchema();
    Object.assign(_config, config);
    return _config;
  }

  /**
   * 从colorSchma返回对应的颜色
   * @param  {number} index
   */
  getColor(index: number) {
    const rounded = index % this.palette.length;
    return this.palette[rounded];
  }
}
