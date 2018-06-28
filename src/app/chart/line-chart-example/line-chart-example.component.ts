import {
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';

import { LineChartConfig, LineChartBuilder } from '../lib';

@Component({
  selector: 'tec-line-chart-example',
  templateUrl: './line-chart-example.component.html',
  styleUrls: ['./line-chart-example.component.sass'],
})
export class LineChartExampleComponent implements OnInit {
  @HostBinding('class.tui-layout-vertical') hostClass = true;

  chartDataJson: string;

  configJson: string;

  config;

  data;

  constructor() {
    this.chartDataJson = JSON.stringify(LineChartBuilder.getMockChartData(), null, 2);
    this.configJson = LineChartConfig.toJson(new LineChartConfig());
  }

  ngOnInit() {
    this.draw();
  }

  draw() {
    this.config = JSON.parse(this.configJson);
    this.data = JSON.parse(this.chartDataJson);
  }


}
