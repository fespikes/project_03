import {
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';

import {
  BarChartConfig,
  BarChartBuilder,
  LineChartBuilder,
} from '../lib';

@Component({
  selector: 'tec-bar-chart-example',
  templateUrl: './bar-chart-example.component.html',
  styleUrls: ['./bar-chart-example.component.sass'],
})
export class BarChartExampleComponent implements OnInit {
  @HostBinding('class.tui-layout-vertical') hostClass = true;

  configJson: string;

  chartDataJson: string;

  config;

  data;

  constructor() {
    this.chartDataJson = JSON.stringify(BarChartBuilder.getMockChartData(), null, 2);
    this.configJson = BarChartConfig.toJson(new BarChartConfig());
  }

  ngOnInit() {
    this.draw();
  }

  draw() {
    this.config = JSON.parse(this.configJson);
    this.data = JSON.parse(this.chartDataJson);
  }

}
