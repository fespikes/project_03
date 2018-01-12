import {
  Component,
  OnInit, AfterViewInit, OnDestroy,
  HostBinding,
  ViewChild, ElementRef,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Pagination } from 'tdc-ui';
import { AbstractService } from './abstract.service';
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

const getSelectOptions = function(type?: string, num?: number) {
  let result: any[] = [];
  const len = num || 12;

  for (let i = len; i > 0; i--) {
    const str: string = i === 1 ? ('last ' + i + (type === 'hour' ? ' hour' : ' month'))
      : ('last ' + i + (type === 'hour' ? ' hours' : ' months'));
    result = [str].concat(result);
  }

  return result;
};
const hourOptions = getSelectOptions('hour');
const monthlyOptions = getSelectOptions();

@Component({
  selector: 'tec-abstract',
  templateUrl: './abstract.component.html',
  styleUrls: ['./abstract.component.sass'],
})
export class AbstractComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('class.tui-layout-body') hostClass = true;

  @ViewChild('platformSummaryHolder') platformSummaryHolder: ElementRef;
  @ViewChild('tenantGrowTrendHolder') tenantGrowTrendHolder: ElementRef;
  @ViewChild('nodeLoadTrendHolder') nodeLoadTrendHolder: ElementRef;
  @ViewChild('nodeAmountTrendHolder') nodeAmountTrendHolder: ElementRef;
  @ViewChild('productsInstancesRankingHolder') productsInstancesRankingHolder: ElementRef;
  @ViewChild('instancesAmountTrendHolder') instancesAmountTrendHolder: ElementRef;
  @ViewChild('productsInstancesTrendHolder') productsInstancesTrendHolder: ElementRef;
  @ViewChild('tenantConsumptionRankingHolder') tenantConsumptionRankingHolder: ElementRef;

  iconId: string;
  instancesAmountTrendOptions: string[] = [...monthlyOptions];
  instancesAmountTrendOption: string;
  listener: Subscription;
  loading = true;
  nodeAmountTrendOptions: string[] = [...monthlyOptions];
  nodeAmountTrendOption: string;
  nodeLoadTrendOptions: string[] = [...hourOptions];
  nodeLoadTrendOption: string;
  platformSummaryOptions: string[] = [...hourOptions];
  platformSummaryOption: string;
  productsInstancesRankingOptions: string[] = [...monthlyOptions];
  productsInstancesRankingOption: string;
  productsInstancesTrendOptions: string[] = [...monthlyOptions];
  productsInstancesTrendOption: string;
  quantitySummary: any = {
    nodeCount: '',
    tenantCount: '',
    productCount: '',
    instanceCount: '',
  };
  tenantConsumptionRankingOptions: string[] = [...monthlyOptions];
  tenantConsumptionRankingOption: string;
  tenantGrowTrendOptions: string[] = [...monthlyOptions];
  tenantGrowTrendOption: string;


  // S: charts related
  // 2.平台概览 chart-donut
  donutChartConfig: DonutChartConfig = new DonutChartConfig();
  loadSummary: any;
  platformSummaryDonuts = new DonutChart();
  platformSummaryDonutsConfig: DonutChartConfig = new DonutChartConfig();

  // 3.租户增长趋势
  tenantGrowTrendConfig: LineChartConfig = new LineChartConfig();
  tenantGrowTrendData: any;
  tenantGrowTrendLineChart = new LineChart();

  // 4.
  nodeLoadTrendConfig: LineChartConfig = new LineChartConfig();
  nodeLoadTrendData: any;
  nodeLoadTrendLineChart = new LineChart();

  // 5.主机变化趋势
  nodeAmountTrendConfig: LineChartConfig = new LineChartConfig();
  nodeAmountTrendData: any;
  nodeAmountTrendLineChart = new LineChart();

  // 6.云产品实例排行
  instancesTemplatesCountConfig: BarChartConfig = new BarChartConfig();
  instancesTemplatesCountData: any;
  instancesTemplatesCountChart = new BarChart();

  // 7.实例总量变化趋势：
  instancesAmountTrendConfig: LineChartConfig = new LineChartConfig();
  instancesAmountTrendData: any;
  instancesAmountTrendLineChart = new LineChart();

  // 8.云产品实例变化趋势
  productsInstancesTrendConfig: LineChartConfig = new LineChartConfig();
  productsInstancesTrendData: any;
  productsInstancesTrendChart: LineChart = new LineChart();

  // 9.租户消费top7
  tenantConsumptionRankConfig: BarChartConfig = new BarChartConfig();
  tenantConsumptionRankData: any;
  tenantConsumptionRankChart = new BarChart();
  // E: charts related

  constructor(
    private abstractService: AbstractService,
  ) {
    this.instancesAmountTrendOption = this.instancesAmountTrendOptions[5];
    this.nodeAmountTrendOption = this.nodeAmountTrendOptions[5];
    this.nodeLoadTrendOption = this.nodeLoadTrendOptions[0];
    this.platformSummaryOption = this.platformSummaryOptions[0];
    this.productsInstancesRankingOption = this.productsInstancesRankingOptions[5];
    this.productsInstancesTrendOption = this.productsInstancesTrendOptions[5];
    this.tenantConsumptionRankingOption = this.tenantConsumptionRankingOptions[5];
    this.tenantGrowTrendOption = this.tenantGrowTrendOptions[5];
  }

  drawPlatformSummary() {
    const element: HTMLElement = this.platformSummaryHolder.nativeElement;
    const { clientWidth, clientHeight } = element;
    const { style, legendStyle } = this.donutChartConfig;

    this.platformSummaryDonutsConfig.style = {
      ...style,
      ...{
        width: clientWidth,
        height: clientHeight,
        thickness: 15,
        maxRadius: 65,
        left: 24,
        top: 70,
      },
    };

    this.platformSummaryDonutsConfig.legendStyle.width = 80;

    this.platformSummaryDonutsConfig.donutChartHolder = element;
    this.platformSummaryDonutsConfig.showLeftLenend = true;

    const config = DonutChartConfig.from(this.platformSummaryDonutsConfig);

    this.platformSummaryDonuts.setConfig(config).datum(this.loadSummary);

    this.platformSummaryDonuts.draw();
  }

  drawTenantGrowTrend() {
    const element: HTMLElement = this.tenantGrowTrendHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    this.tenantGrowTrendConfig = {
      ...this.tenantGrowTrendConfig,
      ...{
        width: clientWidth,
        height: clientHeight,
      },
    };

    this.tenantGrowTrendConfig.legend.width = 0;

    const config = LineChartConfig.from(this.tenantGrowTrendConfig);
    const str = JSON.stringify(this.tenantGrowTrendData);

    this.tenantGrowTrendLineChart.setConfig(config)
      .select(element)
      .datum(LineChartBuilder.parseChartData(str));

    this.tenantGrowTrendLineChart.draw();
  }

  drawNodeLoadTrend() {
    const element: HTMLElement = this.nodeLoadTrendHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    this.nodeLoadTrendConfig = {
      ...this.nodeLoadTrendConfig,
      ...{
        width: clientWidth,
        height: clientHeight,
      },
    };

    const config = LineChartConfig.from(this.nodeLoadTrendConfig);
    const str = JSON.stringify(this.nodeLoadTrendData);

    this.nodeLoadTrendLineChart.setConfig(config)
      .select(element)
      .datum(LineChartBuilder.parseChartData(str));
    this.nodeLoadTrendLineChart.draw();

  }

  drawNodeAmountTrend() {
    const element: HTMLElement = this.nodeAmountTrendHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    this.nodeAmountTrendConfig = {
      ...this.nodeAmountTrendConfig,
      ...{
        width: clientWidth,
        height: clientHeight,
      },
    };

    const config = LineChartConfig.from(this.nodeAmountTrendConfig);
    const str = JSON.stringify(this.nodeAmountTrendData);

    this.nodeAmountTrendLineChart.setConfig(config)
      .select(element)
      .datum(LineChartBuilder.parseChartData(str));

    this.nodeAmountTrendLineChart.draw();
  }

  drawInstancesAmountTrend() {
    const element: HTMLElement = this.instancesAmountTrendHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    this.instancesAmountTrendConfig = {
      ...this.instancesAmountTrendConfig,
      ...{
        width: clientWidth,
        height: clientHeight,
      },
    };

    const config = LineChartConfig.from(this.instancesAmountTrendConfig);
    const str = JSON.stringify(this.instancesAmountTrendData);

    this.instancesAmountTrendLineChart.setConfig(config)
      .select(element)
      .datum(LineChartBuilder.parseChartData(str));

    this.instancesAmountTrendLineChart.draw();
  }

  drawInstancesTemplatesCount() {
    const element: HTMLElement = this.productsInstancesRankingHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    this.instancesTemplatesCountConfig = {
      ...this.instancesTemplatesCountConfig,
      ...{
        stack: true,
        width: clientWidth,
        height: clientHeight,
      },
    };

    const config = BarChartConfig.from(this.instancesTemplatesCountConfig);
    const str = JSON.stringify(this.instancesTemplatesCountData);

    this.instancesTemplatesCountChart.setConfig(config)
      .select(element)
      .datum(BarChartBuilder.parseChartData(str));

    this.instancesTemplatesCountChart.draw();
  }

  drawproductsInstancesTrend() {
    const element: HTMLElement = this.productsInstancesTrendHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    this.productsInstancesTrendConfig = {
      ...this.productsInstancesTrendConfig,
      ...{
        width: clientWidth,
        height: clientHeight,
      },
    };

    const config = LineChartConfig.from(this.productsInstancesTrendConfig);
    const str = JSON.stringify(this.productsInstancesTrendData);

    this.productsInstancesTrendChart.setConfig(config)
      .select(element)
      .datum(LineChartBuilder.parseChartData(str));
    this.productsInstancesTrendChart.draw();
  }

  // 租户消费top7
  drawTenantConsumptionRanking() {
    const element: HTMLElement = this.tenantConsumptionRankingHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    this.tenantConsumptionRankConfig = {
      ...this.tenantConsumptionRankConfig,
      ...{
        stack: true,
        width: clientWidth,
        height: clientHeight,
      },
    };

    const config = BarChartConfig.from(this.tenantConsumptionRankConfig);
    const str = JSON.stringify(this.tenantConsumptionRankData);

    this.tenantConsumptionRankChart.setConfig(config)
      .select(element)
      .datum(BarChartBuilder.parseChartData(str));

    this.tenantConsumptionRankChart.draw();
  }

  fetchData() {
    // TODO: loading optimization
    // currently, this solution has some weakness:
    // - no sequences ;
    // - no loading signals

    // 1.云平台概览
    this.abstractService.getQuantitySummary().subscribe(response => {
      this.quantitySummary = response;
    });

    // 2.平台概览
    this.abstractService.getLoadSummary(adjustedData => {
      this.loadSummary = adjustedData;
      this.drawPlatformSummary();
    });

    // 3.租户增长趋势
    this.abstractService.getTenantCountTrend(adjustedData => {
      this.tenantGrowTrendData = adjustedData;
      this.drawTenantGrowTrend();
    });

    // 4.云产品实例变化趋势
    this.abstractService.getNodesLoadTrend(adjustedData => {
      this.nodeLoadTrendData = adjustedData;
      this.drawNodeLoadTrend();
    });

    // 5.主机变化趋势
    this.abstractService.getNodesCountTrend(adjustedData => {
      this.nodeAmountTrendData = adjustedData;
      this.drawNodeAmountTrend();
    });

    // 6.云产品实例排行
    this.abstractService.getInstancesTemplatesCountRank(adjustedData => {
      this.instancesTemplatesCountData = adjustedData;
      this.drawInstancesTemplatesCount();
    });

    // 7.实例总量变化趋势
    this.abstractService.getInstancesCountTrend(adjustedData => {
      this.instancesAmountTrendData = adjustedData;
      this.drawInstancesAmountTrend();
    });

    // 8.云产品实例变化趋势
    this.abstractService.getProductInstancesCountTrend(adjustedData => {
      this.productsInstancesTrendData = adjustedData;
      this.drawproductsInstancesTrend();
    });

    // 9.租户消费top7
    this.abstractService.getTenantsConsumptionsRank(adjustedData => {
      this.tenantConsumptionRankData = adjustedData;
      this.drawTenantConsumptionRanking();
    });
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

  ngOnInit() {
    // TODO: get the icons work
    this.fetchData();
  }

  ngAfterViewInit() {
    setTimeout(() => {

      const widthListener = new ElementWidthListener(this.platformSummaryHolder);
      this.listener = widthListener.startListen()
        .subscribe(() => {
          this.drawPlatformSummary();
          this.drawTenantGrowTrend();
          this.drawNodeLoadTrend();
          this.drawNodeAmountTrend();
          this.drawInstancesAmountTrend();

          // draw other charts
        });
    });
  }

}
