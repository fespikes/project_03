import {
  Component, OnInit,
  ViewChild, ElementRef, Input,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';

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

  static drawing = false;
  static drawerMap = new Map();

  @Input()
  data: any = {
    chartType: chartTypes.bar,
    fetchData: '',
    config: {},
    resourceType: '',  // CPU STORAGE MEMORY
    wrapperName: '',
  };

  @ViewChild('chartHolder') chartHolder: ElementRef;

  chartData: any;
  chartConfig: any;
  chart: any;
  chartType: string;

  static redraw(drawer, key) {
    const Parent = ChartWrapperComponent;
    if (!Parent.drawerMap.get(key)) {
      Parent.drawerMap.set(key, drawer);
    }

    if (Parent.drawing === true) {
      return;
    }
    Parent.drawing = true;

    const resize = Observable.fromEvent(window, 'resize');
    resize.throttleTime(500).subscribe(val => {
      Parent.drawerMap.forEach(obj => {
        const {callback, chartType, chartConfig, chart, chartData} = obj;
        callback(chartType, chartConfig, chart, chartData);
      });
      Parent.drawing = false;
    });
  }

  constructor() {}

  clearMap() {
    ChartWrapperComponent.drawerMap.clear();
  }

  drawChart(type?, chartConfiguration?, theChart?, chartData?) {
    const element: HTMLElement = this.chartHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    if ( clientHeight === 0 || clientWidth === 0 ) {
      return;
    }
    let chartConfig, ChartBuilder;
    const chartType = type || this.chartType;
    this.chartConfig = chartConfiguration || this.chartConfig;
    this.chart = theChart || this.chart;
    this.chartData = chartData || this.chartData;

    switch (chartType) {

      case chartTypes.bar:
        chartConfig = BarChartConfig;
        ChartBuilder = BarChartBuilder;
        this.chartConfig = this.chartConfig || new BarChartConfig();
        this.chart = this.chart || new BarChart();
        break;

      case chartTypes.donut:
        chartConfig = DonutChartConfig;
        this.chartConfig = this.chartConfig || new DonutChartConfig();
        this.chart = this.chart || new DonutChart();
        break;

      case chartTypes.line:
        chartConfig = LineChartConfig;
        ChartBuilder = LineChartBuilder;
        this.chartConfig = this.chartConfig || new LineChartConfig();
        this.chart = this.chart || new LineChart();
        break;

      default:
        console.log('chart type not match.');
        break;
    }
    // TODO: optimization
    if (chartType === chartTypes.donut && this.data.config) {
      this.chartConfig.style = Object.assign({},
        this.chartConfig.style,
        this.data.config.style,
      );
      delete this.data.config.style;
    }

    this.chartConfig = Object.assign({}, this.chartConfig, {
      width: clientWidth,
      height: clientHeight,
    }, this.data.config);

    const config = chartConfig.from(this.chartConfig);
    let str = JSON.stringify(this.chartData);
    if (!str) {
      return;
    }
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
    const data = this.data;

    if (typeof data.fetchData === 'function') {
      data.fetchData(adjustedData => {
        this.chartData = adjustedData;
        this.chartType = data.chartType;
        this.drawChart();

        ChartWrapperComponent.redraw({
          callback: (...param) => {
            this.drawChart(...param);
          },
          chartData: this.chartData,
          chartType: data.chartType,
          chartConfig: this.chartConfig,
          chart: this.chart,
        },
        this.data.wrapperName );

        if (typeof data.showSum === 'function' && adjustedData.totalCount) {
          data.showSum(this.chartData.totalCount);
        }
      },
      num ? num : data.resourceType);
    }
  }

  ngOnInit() {
    this.getChartData();

  }
}
