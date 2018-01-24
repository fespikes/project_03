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
  DonutChart, DonutChartData,
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
  listener: Subscription;
  hourOptions: TimeOption[];
  monthlyOptions: TimeOption[];

  // 1.
  platformSummaryOption: TimeOption;
  platformSummaryParam: any = {};
  @ViewChild('platformSummarySelect') platformSummarySelect: SelectComponent;
  @ViewChild('platformSummaryWrapper') platformSummaryWrapper: ChartWrapperComponent;

  // 2.
  consumptionSummaryParam: any = {};
  @ViewChild('consumptionSummaryWrapper') consumptionSummaryWrapper: ChartWrapperComponent;

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
  @ViewChild('instancesCountWrapper') instancesCountWrapper: ChartWrapperComponent;

  // 6.CPU 负载率
  CPULoadTrendParam: any = {};
  @ViewChild('CPULoadTrendWrapper') CPULoadTrendWrapper: ChartWrapperComponent;

  // 7.内存使用量
  memoryLoadTrendParam: any;
  @ViewChild('memoryLoadTrendWrapper') memoryLoadTrendWrapper: ChartWrapperComponent;

  // 8.磁盘使用量
  storageLoadTrendParam: any;
  @ViewChild('storageLoadTrendWrapper') storageLoadTrendWrapper: ChartWrapperComponent;

  constructor(
    private service: TenantAbstractService,
    private utilService: TecUtilService,
  ) {
    this.chartTypes = chartTypes;
    this.hourOptions = this.utilService.getSelectOptions('hour');
    this.monthlyOptions = this.utilService.getSelectOptions();

    this.platformSummaryOption = this.monthlyOptions[0];
    this.platformSummaryParam = { // 1.
      chartType: chartTypes.donut,
      fetchData: '', // TODO: this.service.fetchPlatformSummary.bind(this.service),
    };

    this.consumptionSummaryParam = { // 2.
      chartType: chartTypes.donut,
      fetchData: this.service.fetchConsumptionSummary.bind(this.service),
      config: {
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
    };

    this.consumptionsTrendOption = this.monthlyOptions[5];
    this.consumptionsTrendParam = { // 4.
      chartType: chartTypes.line,
      fetchData: this.service.fetchConsumptionsTrend.bind(this.service),
    };

    this.instancesCountParam = { // 5.
      chartType: chartTypes.bar,
      fetchData: this.service.fetchInstancesCount.bind(this.service),
      config: {
        stack: true,
      },
    };

    this.CPULoadTrendParam = { // 6.
      chartType: chartTypes.line,
      fetchData: this.service.fetchResourcesTrend.bind(this.service),
      resourceType: resourceTypes.cpu,
    };

    this.memoryLoadTrendParam = { // 7.
      chartType: chartTypes.line,
      fetchData: this.service.fetchResourcesTrend.bind(this.service),
      resourceType: resourceTypes.memory,
    };

    this.storageLoadTrendParam = { // 8.
      chartType: chartTypes.line,
      fetchData: this.service.fetchResourcesTrend.bind(this.service),
      resourceType: resourceTypes.memory,
    };
  }

  ngOnDestroy() {
    if (this.listener) {
      this.listener.unsubscribe();
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.platformSummarySelect.registerOnChange(_ => {    // 1
      this.platformSummaryOption.value === _ ? (p => p)() : (pa => {
        this.platformSummaryOption = this.monthlyOptions[_ - 1];
        this.platformSummaryWrapper.getChartData(_);
      })();
    });

    this.instancesCountTrendSelect.registerOnChange(_ => {  // 3.
      this.instancesCountTrendOption.value === _ ? (p => p)() : (pa => {
        this.instancesCountTrendOption = this.monthlyOptions[_ - 1];
        this.instancesCountTrendWrapper.getChartData(_);
      })();
    });

    this.consumptionsTrendSelect.registerOnChange(_ => {    // 4
      this.consumptionsTrendOption.value === _ ? (p => p)() : (pa => {
        this.consumptionsTrendOption = this.monthlyOptions[_ - 1];
        this.consumptionsTrendWrapper.getChartData(_);
      })();
    });

    setTimeout(() => {
      const widthListener = new ElementWidthListener(this.hostWidthHolder);
      this.listener = widthListener.startListen()
        .subscribe(() => {
          this.platformSummaryWrapper.getChartData(this.platformSummaryOption.value);
          this.consumptionSummaryWrapper.getChartData();
          this.instancesCountTrendWrapper.getChartData(this.instancesCountTrendOption.value);
          this.consumptionsTrendWrapper.getChartData();
          this.consumptionsTrendWrapper.getChartData(this.consumptionsTrendOption.value);
          this.instancesCountWrapper.getChartData();
          this.CPULoadTrendWrapper.getChartData();
          this.memoryLoadTrendWrapper.getChartData();
          this.storageLoadTrendWrapper.getChartData();
        });
    });
  }
}
