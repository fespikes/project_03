import { DonutChartData } from '../chart';
import * as d3 from 'd3';

let mockData ;
export class DonutChartDataBuilder {

  static getMockData() {
    const donutChartData: DonutChartData = new DonutChartData(mockData);
    return donutChartData;
  }

}

mockData = {

  donuts: [
/*    {
      state: 'no1',
      sum: 10,
      columns: [
        'Under 2 Years',
        'Under 3 Years',
        'Under 5 Years',
      ],
      parts: [2, 2, 5],
    },
    {
      state: 'AL',
      sum: 10,
      columns: ['Under 5 Years'],
      parts: [5],
    },*/
    {
      state: 'Bl',
      columns: [
        'Under 5 Years',
        '5 to 13 Years',
      ],
      parts: [310504, 552339],
      /*columns: [
        'Under 5 Years',
        '5 to 13 Years',
        '14 to 17 Years',
        '18 to 24 Years',
        '25 to 44 Years',
        '45 to 64 Years',
        '65 Years and Over',
      ],
      parts: [310504, 552339, 379034, 450818, 1231572, 2015966, 641667],*/
    },
  ],

};

