import {
  Component,
  OnInit,
  ElementRef,
  HostBinding,
  ViewChild,
} from '@angular/core';

import {
  DonutChart,
  DonutChartData,
  DonutChartConfig,
  DonutChartDataBuilder,
} from '../lib';

/**
@desc: this is the container component of Donut chart
*/
@Component({
  selector: 'tec-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.sass'],
})
export class DonutChartComponent implements OnInit {

  @HostBinding('class.tui-layout-vertical') hostClass = true;

  @ViewChild('donutChart') donutChartHolder: ElementRef;

  donutChartData: DonutChartData;
  donutChartDataJson: string;

  donutChartConfig: DonutChartConfig = new DonutChartConfig();
  donutChartConfigJson: string;

  donut: DonutChart = new DonutChart();

  constructor(
  ) {
    const jsonStringify = function(data) {
      return JSON.stringify( data, null, '  ');
    };

    this.donutChartData = DonutChartDataBuilder.getMockData();

    this.donutChartDataJson = jsonStringify(this.donutChartData);
    this.donutChartConfigJson = jsonStringify(this.donutChartConfig);
  }

  ngOnInit() {

    const element: HTMLElement = this.donutChartHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    this.donutChartConfig.style = Object.assign(this.donutChartConfig.style, {
      width: clientWidth,
      height: clientHeight,
    });

    this.donutChartConfig.donutChartHolder = element;

    this.donut.setConfig(this.donutChartConfig).datum(this.donutChartData);

    this.donut.draw();
  }

  type(d) {
    d.population = +d.population;
    return d;
  }

}
