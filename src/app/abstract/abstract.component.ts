import {
  Component,
  OnInit, AfterViewInit, OnDestroy,
  HostBinding,
  ViewChild, ElementRef,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Pagination, SelectComponent } from 'tdc-ui';
import { AbstractService } from './abstract.service';
import {
  TecApiService, TimeOption, ChartWrapperComponent,
  TecUtilService, chartTypes, resourceTypes } from '../shared';
import { hourlyDefaultFormat, xAxisCommon } from '../shared/patterns';
import {
  BarChartConfig,
  BarChartData,
  BarChart,
  BarChartBuilder,

  DonutChart,
  DonutChartData,
  DonutChartConfig,

  LineChart,
  LineChartBuilder,
  LineChartConfig,
} from '../chart/lib';

import { ElementWidthListener } from '../chart/element-width-listener';

@Component({
  selector: 'tec-abstract',
  templateUrl: './abstract.component.html',
  styleUrls: ['./abstract.component.sass'],
})
export class AbstractComponent implements OnInit, OnDestroy {
  @HostBinding('class.tui-layout-body') hostClass = true;
  @ViewChild('listenerHolder') listenerHolder: ElementRef;

  iconId: string;
  listener: Subscription;

  loading = true;
  hourOptions: TimeOption[];
  monthlyOptions: TimeOption[];

  quantitySummary: any = {
    nodeCount: '',
    tenantCount: '',
    productCount: '',
    instanceCount: '',
  };

  // 1.

  // S: charts related
  // 2.平台概览 chart-donut
  platformSummaryParam: any = {};
  platformSummaryOption: TimeOption;
  @ViewChild('platformSummaryWrapper') platformSummaryWrapper: ChartWrapperComponent;

  // 3.租户增长趋势
  tenantGrowTrendOption: TimeOption;
  @ViewChild('tenantGrowTrendWrapper') tenantGrowTrendWrapper: ChartWrapperComponent;
  tenantGrowTrendParam: any = {};

  // 4.
  nodeLoadTrendOption: TimeOption;
  @ViewChild('nodeLoadTrendWrapper') nodeLoadTrendWrapper: ChartWrapperComponent;
  nodeLoadTrendParam: any = {};

  // 5.主机变化趋势
  nodeAmountTrendOption: TimeOption;
  @ViewChild('nodeAmountTrendWrapper') nodeAmountTrendWrapper: ChartWrapperComponent;
  nodeAmountTrendParam: any = {};

  // 6.云产品实例排行
  productsInstancesRankingOption: TimeOption;
  @ViewChild('productsInstancesRankingWrapper') productsInstancesRankingWrapper: ChartWrapperComponent;
  productsInstancesRankingParam: any = {};

  // 7. 实例总量变化趋势
  instancesAmountTrendOption: TimeOption;
  @ViewChild('instancesAmountTrendWrapper') instancesAmountTrendWrapper: ChartWrapperComponent;
  instancesAmountTrendParam: any = {};

  // 8.
  productsInstancesTrendOption: TimeOption;
  @ViewChild('productsInstancesTrendWrapper') productsInstancesTrendWrapper: ChartWrapperComponent;
  productsInstancesTrendParam: any = {};

  // 9.
  tenantConsumptionRankingOption: TimeOption;
  @ViewChild('tenantConsumptionRankingWrapper') tenantConsumptionRankingWrapper: ChartWrapperComponent;
  tenantConsumptionRankingParam: any = {};
  instancesTotalCount: number;

  private specialList: string[] = ['nodeLoadTrendOption'];
  // E: charts related

  constructor(
    private abstractService: AbstractService,
    private utilService: TecUtilService,
  ) {
    this.hourOptions = this.utilService.getSelectOptions('hour');
    this.monthlyOptions = this.utilService.getSelectOptions();

    this.platformSummaryOption = this.hourOptions[0];
    this.instancesAmountTrendOption = this.monthlyOptions[5];
    this.nodeAmountTrendOption = this.monthlyOptions[5];
    this.nodeLoadTrendOption = this.hourOptions[23];
    this.productsInstancesRankingOption = this.monthlyOptions[0];
    this.productsInstancesTrendOption = this.monthlyOptions[0];
    this.tenantConsumptionRankingOption = this.monthlyOptions[5];
    this.tenantGrowTrendOption = this.monthlyOptions[5];

    this.platformSummaryParam = { // 2.
      chartType: chartTypes.donut,
      fetchData: this.abstractService.getLoadSummary.bind(this.abstractService),
      config: {
        thickness: 40,
        maxRadius: 40,
        style: {
          top: 20,
        },
      },
      wrapperName: 'platformSummaryWrapper',
    };
    this.tenantGrowTrendParam = { // 3.
      chartType: chartTypes.line,
      fetchData: this.abstractService.getTenantCountTrend.bind(this.abstractService),
      config: {
        drawGridY: false,
        legend: {
          show: false,
        },
      },
      wrapperName: 'tenantGrowTrendWrapper',
    };

    const xAxis = {...xAxisCommon};
    xAxis.tick.timeFormat = hourlyDefaultFormat;
    this.nodeLoadTrendParam = {  // 4.
      chartType: chartTypes.line,
      fetchData: this.abstractService.getNodesLoadTrend.bind(this.abstractService),
      config: {
        drawGridY: false,
        xAxis: xAxis,
      },
      wrapperName: 'nodeLoadTrendWrapper',
    };
    this.nodeAmountTrendParam = {  // 5.
      chartType: chartTypes.line,
      fetchData: this.abstractService.getNodesCountTrend.bind(this.abstractService),
      config: {
        drawGridY: false,
        legend: {
          show: false,
        },
      },
      wrapperName: 'nodeAmountTrendWrapper',
    };
    this.productsInstancesRankingParam = { // 6.云产品实例排行
      chartType: chartTypes.bar,
      fetchData: this.abstractService.getInstancesTemplatesCountRank.bind(this.abstractService),
      config: {
        stack: true,
      },
      wrapperName: 'productsInstancesRankingWrapper',
      showSum: (sum: number) => {
        this.instancesTotalCount = sum;
      },
    };
    this.instancesAmountTrendParam = { // 7.实例总量变化趋势
      chartType: chartTypes.line,
      fetchData: this.abstractService.getInstancesCountTrend.bind(this.abstractService),
      config: {
        drawGridY: false,
        legend: {
          show: false,
        },
      },
      wrapperName: 'instancesAmountTrendWrapper',
    };
    this.productsInstancesTrendParam = { // 8.云产品实例变化趋势
      chartType: chartTypes.line,
      fetchData: this.abstractService.getProductInstancesCountTrend.bind(this.abstractService),
      config: {
        curveStyle: 'curveLinear',
        drawGridY: false,
      },
      wrapperName: 'productsInstancesTrendWrapper',
    };
    this.tenantConsumptionRankingParam = { // 9.租户消费top7
      chartType: chartTypes.bar,
      fetchData: this.abstractService.getTenantsConsumptionsRank.bind(this.abstractService),
      config: {
        legend: {
          show: false,
        },
        'yAxis': {
          'tick': {
            'padding': 0,
          },
          'grid': {
            'style': 'solid',
            'color': '#f0f3f7',
            'strokeWidth': 1,
          },
          'lineStyle': {
            'color': '#f0f3f7',
            'strokeWidth': 1,
          },
          'textStyle': {
            'color': '#c2c9d5',
            'foneSize': 12,
          },
        },
        'margin': {
          'top': 10,
          'right': 30,
          'bottom': 30,
          'left': 60,
        },
      },
      wrapperName: 'tenantConsumptionRankingWrapper',
    };
  }

  ngOnDestroy() {
    this.platformSummaryWrapper.clearMap();
  }

  ngOnInit() {
    // TODO: loading optimization
    // currently, this solution has some weakness:
    // - no sequences ;
    // - no loading signals
    // 1.云平台概览
    this.abstractService.getQuantitySummary().subscribe(response => {
      this.quantitySummary = response;
    });
  }

  doModelChange($event, optionName, wrapper) {
    const option = this[optionName];
    if ($event.value !== option.value) {
      this[optionName] = $event;
      this.adjustConfigByOption($event.value, optionName);
      wrapper.getChartData($event.value);
    }
  }

  /**
  * complicated rules here:
  * - for a wrapper, the param and the option must have the same part like:
  *   xxxxxxxxOption && xxxxxxxxParam
  * - they has two types of formatter:
  *   for monthly: '%x'  -  '%d %b'(when in one month)
  *   for hourly: '%H:%M %b'  -  '%H:%M'(when in one month)
  */
  adjustConfigByOption(idx, optionName) {
    let format: string;
    const xAxis: any = {...xAxisCommon};
    const configName: string = optionName.replace('Option', 'Param');

    if (idx > 1) {
      format = this.specialList.indexOf(optionName) > -1 ?
        hourlyDefaultFormat : '%x';
    } else {
      format = this.specialList.indexOf(optionName) > -1 ?
        '%H:%M' : '%d %b';
    }

    xAxis.tick.timeFormat = format;
    this.utilService.addToNameSpace(
      this[configName],
      'config.xAxis',
      xAxis,
    );
  }

}
