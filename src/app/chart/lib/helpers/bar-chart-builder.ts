import { BarChartData } from '../bar';

const mockData = {
  xs: ['Quater 1', 'Quater 2', 'Quoter 3', 'Quoter 4'],
  data: [
    {
      topic: 'Shanghai',
      ys: [345, 413, 226, 653],
    },
    {
      topic: 'Beijing',
      ys: [491, 531, 356, 442],
    },
    {
      topic: 'Shenzhen',
      ys: [215, 394, 284, 376],
    },
  ],
};

export class BarChartBuilder {
  static getMockChartData() {
    return BarChartData.create(mockData);
  }

  static parseChartData(json: string) {
    const data = JSON.parse(json);
    return BarChartData.create(data);
  }
}
