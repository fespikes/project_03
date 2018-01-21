import {
  Component, OnInit, HostBinding, AfterViewInit, OnDestroy,
  ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { SelectComponent } from 'tdc-ui';
import {
  TecApiService, TimeOption, ChartWrapperComponent,
  TecUtilService, chartTypes, resourceTypes } from '../../../shared';
import {
  BarChartConfig, BarChartData, BarChart, BarChartBuilder,
  DonutChart, DonutChartData, DonutChartConfig,
  LineChart, LineChartBuilder, LineChartConfig,
} from '../../../chart/lib';
import { ElementWidthListener } from '../../../chart/element-width-listener';

import { TenantAbstractService } from './tenant-abstract.service';

@Component({
  selector: 'tec-tenant-abstract',
  templateUrl: './tenant-abstract.component.html',
  styleUrls: ['./tenant-abstract.component.sass'],
})
export class TenantAbstractComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('hostWidth') hostWidthHolder: ElementRef;

  chartTypes: any;
  donutChartConfig: DonutChartConfig = new DonutChartConfig();
  listener: Subscription;
  platformSummaryData: any;
  platformSummaryDonuts = new DonutChart();

  hourOptions: TimeOption[];
  monthlyOptions: TimeOption[];

  // 1.
  platformSummaryOption: TimeOption;
  platformSummaryParam: any = {};
  @ViewChild('platformSummarySelect') platformSummarySelect: SelectComponent;
  @ViewChild('platformSummaryWrapper') platformSummaryWrapper: ChartWrapperComponent;


  // TODO: remove all #consumptionSummary not needed
  // 2.
  consumptionSummaryParam: any = {};

  // 3.云产品实例变化趋势
  instancesCountTrendOption: TimeOption;
  instancesCountTrendParam: any = {};
  @ViewChild('instancesCountTrendSelect') instancesCountTrendSelect: SelectComponent;
  @ViewChild('instancesCountTrendWrapper') instancesCountTrendWrapper: ChartWrapperComponent;

  // 4.消费变化趋势
  consumptionsTrendOption: TimeOption;
  consumptionsTrendParam: any = {};
  @ViewChild('consumptionsTrendSelect') consumptionsTrendSelect: SelectComponent;
  @ViewChild('consumptionsTrendWrapper') consumptionsTrendWrapper: ChartWrapperComponent;

  // 5.云产品实例数量
  instancesCountParam: any = {};

  // 6.CPU 负载率
  CPULoadTrendParam: any = {};

  // 7.内存使用量
  memoryLoadTrendParam: any;

  // 8.磁盘使用量
  storageLoadTrendParam: any;

  constructor(
    private service: TenantAbstractService,
    private utilService: TecUtilService,
  ) {
    this.chartTypes = chartTypes;
    this.hourOptions = this.utilService.getSelectOptions('hour');
    this.monthlyOptions = this.utilService.getSelectOptions();

    this.platformSummaryOption = this.hourOptions[0];
    this.platformSummaryParam = { // 1.
      chartType: chartTypes.donut,
      fetchData: '', // TODO: this.service.fetchPlatformSummary.bind(this.service),
      config: {
        testProperty: 'config.fetchPlatformSummary',
      },
    };

    this.consumptionSummaryParam = { // 2.
      chartType: chartTypes.donut,
      fetchData: this.service.fetchConsumptionSummary.bind(this.service),
      config: {
        thickness: 40,  // TODO: adjust the width to the box width;
        maxRadius: 40,
        style: {
          top: 20,
        },
      },
    };

    this.instancesCountTrendOption = this.monthlyOptions[5];
    this.instancesCountTrendParam = { // 3.
      chartType: chartTypes.line,
      fetchData: this.service.fetchInstancesCountTrend.bind(this.service),
      config: {
        testProperty: 'config.instancesCountTrendParam',
      },
    };

    this.consumptionsTrendOption = this.monthlyOptions[5];
    this.consumptionsTrendParam = { // 4.
      chartType: chartTypes.line,
      fetchData: this.service.fetchConsumptionsTrend.bind(this.service),
      config: {
        testProperty: 'config.consumptionsTrendParam',
      },
    };

    this.instancesCountParam = { // 5.
      chartType: chartTypes.bar,
      fetchData: this.service.fetchInstancesCount.bind(this.service),
      config: {
        stack: true,
        testProperty: 'config.instancesCountParam',
      },
    };

    this.CPULoadTrendParam = { // 6.
      chartType: chartTypes.line,
      fetchData: this.service.fetchResourcesTrend.bind(this.service),
      config: {
        testProperty: 'config.instancesCountParam',
      },
      resourceType: resourceTypes.cpu,
    };

    this.memoryLoadTrendParam = { // 7.
      chartType: chartTypes.line,
      fetchData: this.service.fetchResourcesTrend.bind(this.service),
      config: {
        testProperty: 'config.instancesCountParam',
      },
      resourceType: resourceTypes.memory,
    };

    this.storageLoadTrendParam = { // 8.
      chartType: chartTypes.line,
      fetchData: this.service.fetchResourcesTrend.bind(this.service),
      config: {
        testProperty: 'config.instancesCountParam',
      },
      resourceType: resourceTypes.memory,
    };
  }

  drawPlatformSummary() {
  }

  ngOnDestroy() {
    if (this.listener) {
      this.listener.unsubscribe();
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {

    this.platformSummarySelect.registerOnChange(_ => {    // 1
      this.platformSummaryWrapper.getChartData(_);
    });
    this.instancesCountTrendSelect.registerOnChange(_ => {  // 3.
      this.instancesCountTrendWrapper.getChartData(_);
    });
    this.consumptionsTrendSelect.registerOnChange(_ => {    // 4
      this.consumptionsTrendWrapper.getChartData(_);
    });

    setTimeout(() => {
      const widthListener = new ElementWidthListener(this.hostWidthHolder);
      this.listener = widthListener.startListen()
        .subscribe(() => {
          // this.getPlatformSummary();
        });
    });

  }
}
