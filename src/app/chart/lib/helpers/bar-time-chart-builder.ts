import { BarTimeChartData } from '../bar-time';


const mockData = [
  {
    time: '2018-01-01 01:02',
    value: 0,
  },
  {
    time: '2018-01-01 01:04',
    value: 0,
  },
  {
    time: '2018-01-01 01:06',
    value: 0,
  },
  {
    time: '2018-01-01 01:08',
    value: 0,
  },
  {
    time: '2018-01-01 01:10',
    value: 0,
  },
  {
    time: '2018-01-01 01:12',
    value: 0,
  },
  {
    time: '2018-01-01 01:14',
    value: 0,
  },
  {
    time: '2018-01-01 01:16',
    value: 0,
  },
  {
    time: '2018-01-01 01:18',
    value: 0,
  },
  {
    time: '2018-01-01 01:20',
    value: 0,
  },
  {
    time: '2018-01-01 01:22',
    value: 0,
  },
  {
    time: '2018-01-01 01:24',
    value: 0,
  },
  {
    time: '2018-01-01 01:26',
    value: 0,
  },
  {
    time: '2018-01-01 01:28',
    value: 0,
  },
  {
    time: '2018-01-01 01:30',
    value: 0,
  },
  {
    time: '2018-01-01 01:32',
    value: 0,
  },
  {
    time: '2018-01-01 01:34',
    value: 0,
  },
  {
    time: '2018-01-01 01:36',
    value: 0,
  },
  {
    time: '2018-01-01 01:38',
    value: 0,
  },
  {
    time: '2018-01-01 01:40',
    value: 0,
  },
  {
    time: '2018-01-01 01:42',
    value: 0,
  },
  {
    time: '2018-01-01 01:44',
    value: 0,
  },
  {
    time: '2018-01-01 01:46',
    value: 0,
  },
  {
    time: '2018-01-01 01:48',
    value: 0,
  },
  {
    time: '2018-01-01 01:50',
    value: 0,
  },
  {
    time: '2018-01-01 01:52',
    value: 0,
  },
  {
    time: '2018-01-01 01:54',
    value: 0,
  },
  {
    time: '2018-01-01 01:56',
    value: 0,
  },
  {
    time: '2018-01-01 01:58',
    value: 0,
  },
  {
    time: '2018-01-01 02:00',
    value: 0,
  },
];


const seed = new Date().getMilliseconds();
mockData.map((d) => {
  d.value = Math.floor(Math.random() * seed);
});

export class BarTimeChartBuilder {
  static getMockChartData() {
    const _data = mockData.map(d => {
      return {
        x: d.time,
        y: d.value,
      };
    });

    return BarTimeChartData.create(_data);
  }

  static parseChartData(json: string) {
    const data = JSON.parse(json);
    return BarTimeChartData.create(data.series);
  }
}
