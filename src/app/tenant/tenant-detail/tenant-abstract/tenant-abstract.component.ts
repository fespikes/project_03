import {
  Component, OnInit, HostBinding, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, Output,
} from '@angular/core';
import { Router } from '@angular/router';
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
import { hourlyDefaultFormat, xAxisCommon } from '../../../shared/patterns';

@Component({
  selector: 'tec-tenant-abstract',
  templateUrl: './tenant-abstract.component.html',
  styleUrls: ['./tenant-abstract.component.sass'],
})
export class TenantAbstractComponent implements OnInit, OnDestroy {
  @ViewChild('hostWidth') hostWidthHolder: ElementRef;

  chartTypes: any;
  listener: Subscription;
  hourOptions: TimeOption[];
  monthlyOptions: TimeOption[];
  consumptionSummary: any = {
    unpaidAmount: 0,
    monthAmount: 0,
    historyAmount: 0,
  };

  // 1.
  platformSummaryOption: TimeOption;
  platformSummaryParam: any = {};
  @ViewChild('platformSummaryWrapper') platformSummaryWrapper: ChartWrapperComponent;

  // 2.

  // 3.云产品实例变化趋势
  instancesCountTrendOption: TimeOption;
  instancesCountTrendParam: any = {};
  @ViewChild('instancesCountTrendWrapper') instancesCountTrendWrapper: ChartWrapperComponent;

  // 4.消费变化趋势
  consumptionsTrendOption: TimeOption;
  consumptionsTrendParam: any = {};
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

  CPULoadLastHour: any = {
    avg: '',
    max: '',
    min: '',
    now: '',
  };

  memoryLoadLastHour: any = {
    avg: '',
    max: '',
    min: '',
    now: '',
  };

  storageLoadLastHour: any = {
    avg: '',
    max: '',
    min: '',
    now: '',
  };

  constructor(
    private service: TenantAbstractService,
    private utilService: TecUtilService,
    private router: Router,
  ) {
    this.chartTypes = chartTypes;
    this.hourOptions = this.utilService.getSelectOptions('hour');
    this.monthlyOptions = this.utilService.getSelectOptions();

    this.platformSummaryOption = this.monthlyOptions[0];
    this.platformSummaryParam = { // 1.
      chartType: chartTypes.donut,
      fetchData: this.service.fetchPlatformSummary.bind(this.service),
      wrapperName: 'tenantPlatformSummaryWrapper',
    };

    // 2.
    this.service.fetchConsumptionSummary((res) => {
      this.consumptionSummary = res;
    });

    this.instancesCountTrendOption = this.monthlyOptions[5];
    this.instancesCountTrendParam = { // 3.
      chartType: chartTypes.line,
      fetchData: this.service.fetchInstancesCountTrend.bind(this.service),
      wrapperName: 'instancesCountTrendWrapper',
      config: {
        drawGridY: false,
        xAxis: {
          tick: {
            count: 3,
          },
          grid: false,
        },
        yAxis: {
          tick: {
            format: 'd',
          },
        },
        legend: {
          show: false,
        },
      },
    };

    this.consumptionsTrendOption = this.monthlyOptions[5];
    this.consumptionsTrendParam = { // 4.
      chartType: chartTypes.line,
      fetchData: this.service.fetchConsumptionsTrend.bind(this.service),
      wrapperName: 'consumptionsTrendWrapper',
      config: {
        drawGridY: false,
        legend: {
          show: false,
        },
        xAxis: {
          tick: {
            count: 4,
          },
          grid: false,
        },
        yAxis: {
          tick: {
            padding: 0,
          },
        },
        margin: {
          top: 10,
          right: 40,
          bottom: 40,
          left: 60,
        },
      },
    };

    this.instancesCountParam = { // 5.
      chartType: chartTypes.bar,
      fetchData: this.service.fetchInstancesCount.bind(this.service),
      config: {
        stack: true,
        yAxis: {
          tick: {
            format: 'd',
          },
        },
      },
      wrapperName: 'instancesCountWrapper',
    };

    this.CPULoadTrendParam = { // 6.
      chartType: chartTypes.line,
      fetchData: (cb, resourceType) => {
        const callback = (data) => {
          this.CPULoadLastHour = data.lastHour;
          cb(data.result);
        };
        return this.service.fetchResourcesTrend.bind(this.service)(callback, resourceType);
      },
      config: {
        xAxis: {
          tick: {
            count: 4,
            timeFormat: '%H:%M',
          },
          grid: false,
        },
      },
      resourceType: resourceTypes.cpu,
      wrapperName: 'CPULoadTrendWrapper',
    };

    this.memoryLoadTrendParam = { // 7.
      chartType: chartTypes.line,
      fetchData: (cb, resourceType) => {
        const callback = (data) => {
          this.memoryLoadLastHour = data.lastHour;
          cb(data.result);
        };
        this.service.fetchResourcesTrend.bind(this.service)(callback, resourceType);
      },
      config: {
        xAxis: {
          tick: {
            count: 4,
            timeFormat: '%H:%M',
          },
          grid: false,
        },
      },
      resourceType: resourceTypes.memory,
      wrapperName: 'memoryLoadTrendWrapper',
    };

    this.storageLoadTrendParam = { // 8.
      chartType: chartTypes.line,
      fetchData: (cb, resourceType) => {
        const callback = (data) => {
          this.storageLoadLastHour = data.lastHour;
          cb(data.result);
        };
        this.service.fetchResourcesTrend.bind(this.service)(callback, resourceType);
      },
      config: {
        xAxis: {
          tick: {
            count: 4,
            timeFormat: '%H:%M',
          },
          grid: false,
        },
      },
      resourceType: resourceTypes.storage,
      wrapperName: 'storageLoadTrendWrapper',
    };
  }

  ngOnDestroy() {
    if (this.listener) {
      this.listener.unsubscribe();
    }
  }

  ngOnInit() { }

  doModelChange($event, optionName, wrapper) {
    const option = this[optionName];
    if ($event.value !== option.value) {
      this[optionName] = $event;
      wrapper.getChartData($event.value);
    }
  }

  toConsumptionDetails($event) {
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    this.router.navigate([`/tenant/detail/${uid}`], { queryParams: { idx: 4 } })
      .then(_ => _ );
  }

}
