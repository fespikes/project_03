import { BarChartData } from '../chart';

const mockData = {
  xs: ['Quater 1', 'Quater 2', 'Quoter 3', 'Quoter 4'],
  series: [
    {
      topic: 'Shanghai',
      data: [345, 413, 226, 653],
    },
    {
      topic: 'Beijing',
      data: [491, 531, 356, 442],
    },
    {
      topic: 'Shenzhen',
      data: [215, 394, 284, 376],
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
