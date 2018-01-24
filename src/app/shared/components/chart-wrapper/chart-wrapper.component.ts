import {
  Component, OnInit,
  ViewChild, ElementRef, Input,
} from '@angular/core';

import {
  BarChartConfig, BarChartData, BarChart, BarChartBuilder,
  DonutChart, DonutChartData, DonutChartConfig,
  LineChart, LineChartBuilder, LineChartConfig,
} from '../../../chart/lib';

import { TecUtilService } from '../../';
import { chartTypes } from '../../models';

@Component({
  selector: 'tec-chart-wrapper',
  templateUrl: './chart-wrapper.component.html',
  styleUrls: ['./chart-wrapper.component.sass'],
})
export class ChartWrapperComponent implements OnInit {

  @Input()
  chartType: string = chartTypes.bar;

  @Input()
  fetchData: any;

  @Input()
  config: any;

  @Input()
  resourceType: string;  // CPU STORAGE MEMORY

  @ViewChild('chartHolder') chartHolder: ElementRef;

  chartData: any;
  chartConfig: any;
  chart: any;

  constructor() { }

  drawChart(chartType) {
    const element: HTMLElement = this.chartHolder.nativeElement;
    const { clientWidth, clientHeight } = element;
    let chartConfig, ChartBuilder;

    switch (chartType) {

      case chartTypes.bar:
        chartConfig = BarChartConfig;
        ChartBuilder = BarChartBuilder;
        this.chartConfig = new BarChartConfig();
        this.chart = new BarChart();
        break;

      case chartTypes.donut:
        chartConfig = DonutChartConfig;
        this.chartConfig = new DonutChartConfig();
        this.chart = new DonutChart();
        break;

      case chartTypes.line:
        chartConfig = LineChartConfig;
        ChartBuilder = LineChartBuilder;
        this.chartConfig = new LineChartConfig();
        this.chart = new LineChart();
        break;

      default:
        console.log('chart type not match.');
        break;
    }
    // TODO: optimization
    if (chartType === chartTypes.donut) {
      this.chartConfig.style = Object.assign({},
        this.chartConfig.style,
        this.config.style,
      );
      delete this.config.style;
    }

    this.chartConfig = Object.assign({}, this.chartConfig, {
      width: clientWidth,
      height: clientHeight,
    }, this.config);

    const config = chartConfig.from(this.chartConfig);
    let str = JSON.stringify(this.chartData);
    str = (ChartBuilder ? ChartBuilder.parseChartData(str) : str);

    if (chartType === chartTypes.donut) {
      config.donutChartHolder = element;  // TODO: optimization;
      str = this.chartData;
      this.chart.setConfig(config).datum(str);
    } else {
      this.chart.setConfig(config).select(element)
        .datum(str);
    }

    this.chart.draw();
  }

  public getChartData(num?: number) {
/*    console.log('confirm inputs: ', {    // remove this logger
      chartType: this.chartType,
      fetchData: this.fetchData,
      config: this.config,
      resourceType: this.resourceType,
    });*/
    if (typeof this.fetchData === 'function') {
      this.fetchData(adjustedData => {
        this.chartData = adjustedData;
        this.drawChart(this.chartType);
      }, num ? num : this.resourceType);
    }
  }

  ngOnInit() {
    this.getChartData();
  }
}
