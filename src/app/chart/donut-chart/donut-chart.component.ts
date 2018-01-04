import {
  Component,
  AfterViewInit,
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

import { ElementWidthListener } from '../element-width-listener';

/**
@desc: this is the container component of Donut chart
*/
@Component({
  selector: 'tec-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.sass'],
})
export class DonutChartComponent implements AfterViewInit {

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

  ngAfterViewInit() {
    setTimeout(() => {
      this.draw();

      const listener = new ElementWidthListener(this.donutChartHolder);
      listener.startListen().subscribe(() => {
        this.draw();
      });
    }, 16.7);
  }

  draw() {
    const element: HTMLElement = this.donutChartHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    this.donutChartConfig = DonutChartConfig.from(JSON.parse(this.donutChartConfigJson));

    this.donutChartConfig.style = Object.assign(this.donutChartConfig.style, {
      width: clientWidth,
      height: clientHeight,
    });

    this.donutChartConfig.donutChartHolder = element;

    const config = DonutChartConfig.from(this.donutChartConfig);

    this.donut.setConfig(config).datum(JSON.parse(this.donutChartDataJson));

    this.donut.draw();
  }

}
