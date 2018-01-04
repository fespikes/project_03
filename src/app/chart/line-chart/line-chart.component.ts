import {
  Component,
  OnDestroy,
  HostBinding,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import * as moment from 'moment';

import { Subscription } from 'rxjs/Subscription';

import { LineChart, LineChartConfig, LineChartData, LineChartBuilder } from '../lib';
import { ElementWidthListener } from '../element-width-listener';

@Component({
  selector: 'tec-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.sass'],
})
export class LineChartComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class.tui-layout-vertical') hostClass = true;

  @ViewChild('chart') chartHolder: ElementRef;

  line = new LineChart();

  chartDataJson: string;

  configJson: string;

  listener: Subscription;

  constructor() {
    this.chartDataJson = JSON.stringify(LineChartBuilder.getMockChartData(), null, 2);
    this.configJson = LineChartConfig.toJson(new LineChartConfig());
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

  draw() {
    const element: HTMLElement = this.chartHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    const configParsed = JSON.parse(this.configJson);
    const config = LineChartConfig.from(configParsed);
    Object.assign(config, {
      width: clientWidth,
      height: clientHeight,
    });

    this.line.setConfig(config)
      .select(element)
      .datum(LineChartBuilder.parseChartData(this.chartDataJson));

    // 延时使得看得到销毁过程
    setTimeout(() => {
      this.line.draw();
    }, 100);
  }


}
