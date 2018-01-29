import { LineChartData } from '../line/line';

const mockTopics = ['Shanghai', 'Beijing'];
// 模拟服务返回 array of json。
const mockData = [
  [
    {
      date: '2017-11-02',
      value: 1,
    },
    {
      date: '2017-11-03',
      value: 5,
    },
    {
      date: '2017-11-08',
      value: 2,
    },
    {
      date: '2017-11-10',
      value: 9,
    },
  ],
  [
    {
      date: '2017-11-01',
      value: 3,
    },
    {
      date: '2017-11-03',
      value: 1,
    },
    {
      date: '2017-11-08',
      value: 5,
    },
    {
      date: '2017-11-09',
      value: 1,
    },
  ],
];

export class LineChartBuilder {
  static getMockChartData() {
    return mockTopics.map((topic, idx) => {
      const _data = mockData[idx].map((d) => {
        return {
          x: d.date,
          y: d.value,
        };
      });
      return LineChartData.create(topic, _data);
    });
  }

  static parseChartData(json: string) {
    const data = JSON.parse(json);
    return data.map((d) => {
      return LineChartData.create(d.topic, d.data);
    });
  }
}
