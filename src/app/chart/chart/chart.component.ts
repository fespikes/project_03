import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import debounce from 'lodash-es/debounce';

import { ElementWidthListener } from '../element-width-listener';
import {
  ChartInterface,
  LineChart,
  LineChartConfig,
  LineChartData,
  BarChart,
  BarChartConfig,
  BarChartData,
  BarTimeChart,
  BarTimeChartConfig,
  BarTimeChartData,
} from '../lib';

export class ChartComponent<T, P> extends ElementWidthListener implements OnInit, OnChanges, OnDestroy {
  @ViewChild('chart') chartEl: ElementRef;

  @Input() config: T;

  @Input() data: P;

  chart: ChartInterface;

  widthListener: Subscription;

  draw = debounce(this._draw, 250);

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit() {
    this.widthListener = this.startListen().subscribe(() => {
      this.draw();
    });
  }

  ngOnChanges() {
    if (this.config && this.data) {
      this.draw();
    }
  }

  ngOnDestroy() {
    this.widthListener.unsubscribe();
    this.widthListener = null;
  }

  _draw() {
    const config = this.config;
    const element: HTMLElement = this.chartEl.nativeElement;
    const { clientWidth, clientHeight } = element;
    Object.assign(config, {
      width: clientWidth,
      height: clientHeight,
    });

    this.chart.setConfig(this.config)
      .select(element)
      .datum(this.data)
      .draw();
  }

}

@Component({
  selector: 'tec-line-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass'],
})
export class LineChartComponent extends ChartComponent<LineChartConfig, LineChartData[]> {
  constructor(elementRef: ElementRef) {
    super(elementRef);
    this.chart = new LineChart();
  }
}

@Component({
  selector: 'tec-bar-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass'],
})
export class BarChartComponent extends ChartComponent<BarChartConfig, BarChartData> {
  constructor(elementRef: ElementRef) {
    super(elementRef);
    this.chart = new BarChart();
  }
}

@Component({
  selector: 'tec-bar-time-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass'],
})
export class BarTimeChartComponent extends ChartComponent<BarTimeChartConfig, BarTimeChartData> {
  constructor(elementRef: ElementRef) {
    super(elementRef);
    this.chart = new BarTimeChart();
  }
}
