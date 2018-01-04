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
  BarChartConfig,
  BarChartData,
  BarChart,
  BarChartBuilder,
} from '../lib';
import { ElementWidthListener } from '../element-width-listener';

@Component({
  selector: 'tec-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.sass'],
})
export class BarChartComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class.tui-layout-vertical') hostClass = true;

  @ViewChild('chart') chartHolder: ElementRef;

  config: BarChartConfig;

  configJson: string;

  chartDataJson: string;

  chart = new BarChart();

  listener: Subscription;

  draw = debounce(() => {
    const element: HTMLElement = this.chartHolder.nativeElement;
    const { clientHeight, clientWidth } = element;
    const config = BarChartConfig.from(JSON.parse(this.configJson));
    Object.assign(config, {
      width: clientWidth,
      height: clientHeight,
    });

    this.chart.setConfig(config)
      .select(element)
      .datum(BarChartBuilder.parseChartData(this.chartDataJson));
    this.chart.draw();
  }, 250);

  constructor() {
    this.chartDataJson = JSON.stringify(BarChartBuilder.getMockChartData(), null, 2);
    this.configJson = BarChartConfig.toJson(new BarChartConfig());
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
