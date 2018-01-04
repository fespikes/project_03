import { DonutChartData } from '../donut';
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
    {
      state: 'no1',
      sum: 10,
      parts: [
        {
          'title': 'Under 2 Years',
          'value': 2,
        },
        {
          'title': 'Under 3 Years',
          'value': 3,
        },
        {
          'title': 'Under 5 Years',
          'value': 5,
        },
      ],
    },
    {
      state: 'AL',
      sum: 10,
      parts: [
        {
          'title': 'Under 5 Years',
          'value': 5,
        },
      ],
    },
    {
      state: 'Bl',
      parts: [
        {
          'title': 'Under 5 Years',
          'value': 310504,
        },
        {
          'title': '5 to 13 Years',
          'value': 552339,
        },
        {
          'title': '14 to 17 Years',
          'value': 379034,
        },
        {
          'title': '18 to 24 Years',
          'value': 450818,
        },
        {
          'title': '25 to 44 Years',
          'value': 1231572,
        },
        {
          'title': '45 to 64 Years',
          'value': 2015966,
        },
        {
          'title': '65 Years and Over',
          'value': 641667,
        },
      ],
    },
  ],

};

