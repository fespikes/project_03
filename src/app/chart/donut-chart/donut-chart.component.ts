import {
  Component,
  OnInit,
  ElementRef,
  HostBinding,
  ViewChild,
} from '@angular/core';

import {
  DonutChart,
  DonutChartConfig,
  DonutChartDataBuilder,
} from '../lib';
import * as lib from '../lib';

/**
@desc: this is the container component of Donut chart
*/
@Component({
  selector: 'tec-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.sass'],
})
export class DonutChartComponent implements OnInit {

  private el: ElementRef;

  @HostBinding('class.tui-layout-vertical') hostClass = true;

  @ViewChild('donutChart') donutChartHolder: ElementRef;

  config: any = new DonutChartConfig();

  donut: DonutChart = new DonutChart();

  constructor(
    el: ElementRef,
  ) {
  }

  ngOnInit() {
    console.log(lib);

    const element: HTMLElement = this.donutChartHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    this.config.style = Object.assign(this.config.style, {
      width: clientWidth,
      height: clientHeight,
    });

    this.config.donutChartHolder = element;

    this.donut.setConfig(this.config).datum(DonutChartDataBuilder.getMockData() );


    this.donut.draw();

  }

  type(d) {
    d.population = +d.population;
    return d;
  }

}
