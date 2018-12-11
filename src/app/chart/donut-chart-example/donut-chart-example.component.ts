import {
  Component,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  HostBinding,
  ViewChild,
} from '@angular/core';

import { Subscription } from 'rxjs';

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
  selector: 'tec-donut-chart-example',
  templateUrl: './donut-chart-example.component.html',
  styleUrls: ['./donut-chart-example.component.sass'],
})
export class DonutChartExampleComponent implements OnDestroy, AfterViewInit {

  @HostBinding('class.tui-layout-vertical') hostClass = true;

  @ViewChild('donutChart') donutChartHolder: ElementRef;

  donutChartData: DonutChartData;
  donutChartDataJson: string;

  donutChartConfig: DonutChartConfig = new DonutChartConfig();
  donutChartConfigJson: string;

  donut: DonutChart = new DonutChart();

  listener: Subscription;

  constructor(
  ) {
    const jsonStringify = function(data) {
      return JSON.stringify( data, null, '  ');
    };

    this.donutChartData = DonutChartDataBuilder.getMockData();

    this.donutChartDataJson = jsonStringify(this.donutChartData);
    this.donutChartConfigJson = jsonStringify(this.donutChartConfig);
    // this.donutChartDataJson = `{'donuts':[{'state':'CPU','columns':['已使用(22.02)core','配额(1040)core','上限(1040)core'],'parts':[22.02,1017.98]},{'state':'内存','columns':['已使用(87)Gi','配额(991.32)Gi','上限(991.32)Gi'],'parts':[87,904.32]},{'state':'硬盘','columns':['已使用(null)Gi','配额(null)Gi','上限(null)Gi'],'parts':[null,0]}]}`);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.draw();

      const widthListener = new ElementWidthListener(this.donutChartHolder);
      this.listener = widthListener.startListen()
        .subscribe(() => {
          this.draw();
        });
    });
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
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

    this.donut.setConfig(config).datum(JSON.parse(`{"donuts":[{"state":"CPU负载","columns":["used","unused"],"parts":[0.1659,0.8341]},{"state":"内存负载","columns":["used","unused"],"parts":[0.6923,0.3077]},{"state":"磁盘负载","columns":["used","unused"],"parts":[0.127,0.873]}]}`));

    this.donut.draw();
  }

}
