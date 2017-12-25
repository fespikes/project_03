import {
  Component,
  OnInit,
  HostBinding,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

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
export class BarChartComponent implements OnInit, AfterViewInit {
  @HostBinding('class.tui-layout-vertical') hostClass = true;

  @ViewChild('chart') chartHolder: ElementRef;

  config: BarChartConfig;

  configJson: string;

  chartDataJson: string;

  chart = new BarChart();

  constructor() {
    this.chartDataJson = JSON.stringify(BarChartBuilder.getMockChartData(), null, 2);
    this.configJson = BarChartConfig.toJson(new BarChartConfig());
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.draw();

      const listener = new ElementWidthListener(this.chartHolder);
      listener.startListen().subscribe(() => {
        this.draw();
      });
    });
  }

  draw() {
    this.chart.clear();
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

    setTimeout(() => {
      this.chart.draw();
    }, 100);
  }

}
