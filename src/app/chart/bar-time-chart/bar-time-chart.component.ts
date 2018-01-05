import {
  Component,
  HostBinding,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import * as debounce from 'lodash/debounce';
import { Subscription } from 'rxjs/Subscription';

import {
  BarTimeChartConfig,
  BarTimeChartData,
  BarTimeChart,
  BarTimeChartBuilder,
} from '../lib';

import { ElementWidthListener } from '../element-width-listener';

@Component({
  selector: 'tec-bar-time-chart',
  templateUrl: './bar-time-chart.component.html',
  styleUrls: ['./bar-time-chart.component.sass'],
})
export class BarTimeChartComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class.tui-layout-vertical') hostClass = true;
  @ViewChild('chart') chartHolder: ElementRef;

  config: BarTimeChartConfig;

  configJson: string;

  chartDataJson: string;

  chart = new BarTimeChart;

  listener: Subscription;

  draw = debounce(() => {
    const element: HTMLElement = this.chartHolder.nativeElement;
    const { clientHeight, clientWidth } = element;
    const config = BarTimeChartConfig.from(JSON.parse(this.configJson));
    Object.assign(config, {
      width: clientWidth,
      height: clientHeight,
    });

    this.chart.setConfig(config)
      .select(element)
      .datum(BarTimeChartBuilder.parseChartData(this.chartDataJson));
    this.chart.draw();
  }, 250);

  constructor() {
    this.chartDataJson = JSON.stringify(BarTimeChartBuilder.getMockChartData(), null, 2);
    this.configJson = BarTimeChartConfig.toJson(new BarTimeChartConfig());
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.draw();

      const widthListener = new ElementWidthListener(this.chartHolder);
      this.listener = widthListener.startListen()
        .subscribe(() => {
          this.draw();
        });
    });
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

}
