import {
  Component,
  OnInit,
  HostBinding,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import * as moment from 'moment';

import { LineChart, LineChartConfig, LineChartData, LineChartBuilder } from '../lib';
import { ElementWidthListener } from '../element-width-listener';

@Component({
  selector: 'tec-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.sass'],
})
export class LineChartComponent implements OnInit, AfterViewInit {
  @HostBinding('class.tui-layout-vertical') hostClass = true;

  @ViewChild('lineChart') lineChartHolder: ElementRef;

  config: LineChartConfig;

  line = new LineChart();

  chartDataJson: string;

  configJson: string;

  constructor() {
    this.chartDataJson = JSON.stringify(LineChartBuilder.getMockChartData(), null, 2);
    this.config = new LineChartConfig();
    this.configJson = LineChartConfig.toJson(this.config);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.draw();

      const listener = new ElementWidthListener(this.lineChartHolder);
      listener.startListen().subscribe(() => {
        this.draw();
      });
    });
  }

  draw() {
    this.line.clear();
    const element: HTMLElement = this.lineChartHolder.nativeElement;
    const { clientWidth, clientHeight } = element;
    const configParsed = JSON.parse(this.configJson);
    this.config = LineChartConfig.from(configParsed);
    Object.assign(this.config, {
      width: clientWidth,
      height: clientHeight,
    });

    this.line.setConfig(this.config)
      .select(element)
      .datum(LineChartBuilder.parseChartData(this.chartDataJson));

    // 延时使得看得到销毁过程
    setTimeout(() => {
      this.line.draw();
    }, 100);
  }


}
