import { DonutChartData } from '../donut-chart';
import * as d3 from 'd3';

let mockData ;
export class DonutChartDataBuilder {

  static getMockData() {
    const donutChartData: DonutChartData = new DonutChartData(mockData);
    return donutChartData;
  }

}

mockData = {

  columns: [
    'Under 5 Years', '5 to 13 Years', '14 to 17 Years', '18 to 24 Years',
    '25 to 44 Years', '45 to 64 Years', '65 Years and Over',
  ],

  donuts: [
    {
      'state': 'AL',
      'sum': 4661900,
      'ages': [
        {
          'age': 'Under 5 Years',
          'population': 310504,
        },
        {
          'age': '5 to 13 Years',
          'population': 552339,
        },
        {
          'age': '14 to 17 Years',
          'population': 259034,
        },
        {
          'age': '18 to 24 Years',
          'population': 450818,
        },
        {
          'age': '25 to 44 Years',
          'population': 1231572,
        },
        {
          'age': '45 to 64 Years',
          'population': 1215966,
        },
        {
          'age': '65 Years and Over',
          'population': 641667,
        },
      ],
    },
  ],
};

