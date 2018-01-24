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
export class AbstractComponent implements OnInit, AfterViewInit, OnDestroy {
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
  @ViewChild('loadsSelect') loadsSelect: SelectComponent;
  @ViewChild('platformSummaryWrapper') platformSummaryWrapper: ChartWrapperComponent;

  // 3.租户增长趋势
  tenantGrowTrendOption: TimeOption;
  @ViewChild('tenantGrowTrendWrapper') tenantGrowTrendWrapper: ChartWrapperComponent;
  @ViewChild('tenantGrowTrendSelect') tenantGrowTrendSelect: SelectComponent;
  tenantGrowTrendParam: any = {};

  // 4.
  nodeLoadTrendOption: TimeOption;
  @ViewChild('nodeLoadTrendWrapper') nodeLoadTrendWrapper: ChartWrapperComponent;
  @ViewChild('nodeLoadTrendSelect') nodeLoadTrendSelect: SelectComponent;
  nodeLoadTrendParam: any = {};

  // 5.主机变化趋势
  nodeAmountTrendOption: TimeOption;
  @ViewChild('nodeAmountTrendWrapper') nodeAmountTrendWrapper: ChartWrapperComponent;
  @ViewChild('nodeAmountTrendSelect') nodeAmountTrendSelect: SelectComponent;
  nodeAmountTrendParam: any = {};

  // 6.云产品实例排行
  productsInstancesRankingOption: TimeOption;
  @ViewChild('productsInstancesRankingWrapper') productsInstancesRankingWrapper: ChartWrapperComponent;
  @ViewChild('productsInstancesRankingSelect') productsInstancesRankingSelect: SelectComponent;
  productsInstancesRankingParam: any = {};

  // 7. 实例总量变化趋势
  instancesAmountTrendOption: TimeOption;
  @ViewChild('instancesAmountTrendWrapper') instancesAmountTrendWrapper: ChartWrapperComponent;
  @ViewChild('instancesAmountTrendSelect') instancesAmountTrendSelect: SelectComponent;
  instancesAmountTrendParam: any = {};

  // 8.
  productsInstancesTrendOption: TimeOption;
  @ViewChild('productsInstancesTrendWrapper') productsInstancesTrendWrapper: ChartWrapperComponent;
  @ViewChild('productsInstancesTrendSelect') productsInstancesTrendSelect: SelectComponent;
  productsInstancesTrendParam: any = {};

  // 9.
  tenantConsumptionRankingOption: TimeOption;
  @ViewChild('tenantConsumptionRankingWrapper') tenantConsumptionRankingWrapper: ChartWrapperComponent;
  @ViewChild('tenantConsumptionRankingSelect') tenantConsumptionRankingSelect: SelectComponent;
  tenantConsumptionRankingParam: any = {};
  instancesTotalCount: number;

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
    this.productsInstancesRankingOption = this.monthlyOptions[5];
    this.productsInstancesTrendOption = this.monthlyOptions[5];
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
    };
    this.tenantGrowTrendParam = { // 3.
      chartType: chartTypes.line,
      fetchData: this.abstractService.getTenantCountTrend.bind(this.abstractService),
      config: {},
    };
    this.nodeLoadTrendParam = {  // 4.
      chartType: chartTypes.line,
      fetchData: this.abstractService.getNodesLoadTrend.bind(this.abstractService),
      config: {},
    };
    this.nodeAmountTrendParam = {  // 5.
      chartType: chartTypes.line,
      fetchData: this.abstractService.getNodesCountTrend.bind(this.abstractService),
      config: {},
    };
    this.productsInstancesRankingParam = { // 6.云产品实例排行
      chartType: chartTypes.bar,
      fetchData: this.abstractService.getInstancesTemplatesCountRank.bind(this.abstractService),
      config: {
        stack: true,
      },
    };
    this.instancesAmountTrendParam = { // 7.实例总量变化趋势
      chartType: chartTypes.line,
      fetchData: this.abstractService.getInstancesCountTrend.bind(this.abstractService),
      config: {
      },
    };
    this.productsInstancesTrendParam = { // 8.云产品实例变化趋势
      chartType: chartTypes.line,
      fetchData: this.abstractService.getProductInstancesCountTrend.bind(this.abstractService),
      config: {
        curveStyle: 'curveLinear',
      },
    };
    this.tenantConsumptionRankingParam = { // 9.租户消费top7
      chartType: chartTypes.bar,
      fetchData: this.abstractService.getTenantsConsumptionsRank.bind(this.abstractService),
      config: { },
    };
  }

  ngOnDestroy() {
    if (this.listener) {
      this.listener.unsubscribe();
    }
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

  ngAfterViewInit() {
    this.loadsSelect.registerOnChange(_ => { // 2.
      this.platformSummaryOption.value === _ ? (p => p)() : (pa => {
        this.platformSummaryOption = this.hourOptions[_ - 1];
        this.platformSummaryWrapper.getChartData(_);
      })();
    });
    this.tenantGrowTrendSelect.registerOnChange(_ => { // 3.
      this.tenantGrowTrendOption.value === _ ? (p => p)() : (pa => {
        this.tenantGrowTrendOption = this.monthlyOptions[_ - 1];
        this.tenantGrowTrendWrapper.getChartData(_);
      })();
    });
    this.nodeLoadTrendSelect.registerOnChange(_ => { // 4.
      this.nodeLoadTrendOption.value === _ ? (p => p)() : (pa => {
        this.nodeLoadTrendOption = this.hourOptions[_ - 1];
        this.nodeLoadTrendWrapper.getChartData(_);
      })();
    });
    this.nodeAmountTrendSelect.registerOnChange(_ => { // 5.
      this.nodeAmountTrendOption.value === _ ? (p => p)() : (pa => {
        this.nodeAmountTrendOption = this.monthlyOptions[_ - 1];
        this.nodeAmountTrendWrapper.getChartData(_);
      })();
    });
    this.productsInstancesRankingSelect.registerOnChange(_ => {  // 6.
      this.productsInstancesRankingOption.value === _ ? (p => p)() : (pa => {
        this.productsInstancesRankingOption = this.monthlyOptions[_ - 1];
        this.productsInstancesRankingWrapper.getChartData(_);
      })();
    });
    this.instancesAmountTrendSelect.registerOnChange(_ => {  // 7.
      this.instancesAmountTrendOption.value === _ ? (p => p)() : (pa => {
        this.instancesAmountTrendOption = this.monthlyOptions[_ - 1];
        this.instancesAmountTrendWrapper.getChartData(_);
      })();
    });
    this.productsInstancesTrendSelect.registerOnChange(_ => {  // 8.
      this.productsInstancesTrendOption.value === _ ? (p => p)() : (pa => {
        this.productsInstancesTrendOption = this.monthlyOptions[_ - 1];
        this.productsInstancesTrendWrapper.getChartData(_);
      })();
    });
    this.tenantConsumptionRankingSelect.registerOnChange(_ => {  // 9.
      this.tenantConsumptionRankingOption.value === _ ? (p => p)() : (pa => {
        this.tenantConsumptionRankingOption = this.monthlyOptions[_ - 1];
        this.tenantConsumptionRankingWrapper.getChartData(_);
      })();
    });

    setTimeout(() => {
      const widthListener = new ElementWidthListener(this.listenerHolder);
      this.listener = widthListener.startListen()
        .subscribe(() => {
          this.platformSummaryWrapper.getChartData(this.platformSummaryOption.value);
          this.tenantGrowTrendWrapper.getChartData(this.tenantGrowTrendOption.value);
          this.nodeLoadTrendWrapper.getChartData(this.nodeLoadTrendOption.value);
          this.nodeAmountTrendWrapper.getChartData(this.nodeAmountTrendOption.value);
          this.productsInstancesRankingWrapper.getChartData(this.productsInstancesRankingOption.value);
          this.instancesAmountTrendWrapper.getChartData(this.instancesAmountTrendOption.value);
          this.productsInstancesTrendWrapper.getChartData(this.productsInstancesTrendOption.value);
          this.tenantConsumptionRankingWrapper.getChartData(this.tenantConsumptionRankingOption.value);
        });
    });
  }
}
