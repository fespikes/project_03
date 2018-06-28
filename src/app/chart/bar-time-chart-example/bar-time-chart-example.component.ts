import {
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';

import {
  BarTimeChartConfig,
  BarTimeChartBuilder,
} from '../lib';

@Component({
  selector: 'tec-bar-time-chart-example',
  templateUrl: './bar-time-chart-example.component.html',
  styleUrls: ['./bar-time-chart-example.component.sass'],
})
export class BarTimeChartExampleComponent implements OnInit {
  @HostBinding('class.tui-layout-vertical') hostClass = true;

  configJson: string;

  chartDataJson: string;

  data;

  config;

  constructor() {
    this.chartDataJson = JSON.stringify(BarTimeChartBuilder.getMockChartData(), null, 2);
    this.configJson = BarTimeChartConfig.toJson(new BarTimeChartConfig());
  }

  ngOnInit() {
    this.draw();
  }

  draw() {
    this.config = JSON.parse(this.configJson);
    this.data = BarTimeChartBuilder.getMockChartData();
  }

}
