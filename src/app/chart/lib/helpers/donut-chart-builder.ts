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
      state: 'AL',
      // columns?: [],
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
          'value': 259034,
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
          'value': 1215966,
        },
        {
          'title': '65 Years and Over',
          'value': 641667,
        },
      ],
    },
    {
      state: 'Bl',
      // columns?: [],
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

  /*donuts: [
    {
      columns: [
        'Under 5 Years', '5 to 13 Years', '14 to 17 Years', '18 to 24 Years',
        '25 to 44 Years', '45 to 64 Years', '65 Years and Over',
      ],
      'state': 'AL',
      'sum': 4661900,
      'ages': [
        {
          'age': 'Under 5 Years',
          'value': 310504,
        },
        {
          'age': '5 to 13 Years',
          'value': 552339,
        },
        {
          'age': '14 to 17 Years',
          'value': 259034,
        },
        {
          'age': '18 to 24 Years',
          'value': 450818,
        },
        {
          'age': '25 to 44 Years',
          'value': 1231572,
        },
        {
          'age': '45 to 64 Years',
          'value': 1215966,
        },
        {
          'age': '65 Years and Over',
          'value': 641667,
        },
      ],
    },
  ],*/
};

