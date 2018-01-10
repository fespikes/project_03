import {
  Component,
  OnInit, AfterViewInit, OnDestroy,
  HostBinding,
  ViewChild, ElementRef,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AbstractService } from './abstract.service';
import {
  DonutChart,
  DonutChartData,
  DonutChartConfig,
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

  donutChartConfig: DonutChartConfig = new DonutChartConfig();
  // chart-donut: 平台概览
  platformSummaryDonuts: DonutChart = new DonutChart();
  platformSummaryDonutsConfig: DonutChartConfig = new DonutChartConfig();
  iconId: string;
  instancesAmountTrendOptions: string[] = [...monthlyOptions];
  instancesAmountTrendOption: string;
  listener: Subscription;
  loading = true;
  loadSummary: any;
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

  drawPlatformSummaryDonuts() {
    const element: HTMLElement = this.platformSummaryHolder.nativeElement;
    const { clientWidth, clientHeight } = element;

    this.platformSummaryDonutsConfig.style = {
      ...this.donutChartConfig.style,
      ...{
        width: clientWidth,
        height: clientHeight,
        thickness: 15,
        maxRadius: 65,
        left: 24,
        top: 70,
      },
    };

    this.platformSummaryDonutsConfig.legendStyle = {
      ...this.donutChartConfig.legendStyle,
      ...{ width: 80 },
    };

    console.log('this.donutChartConfig:', this.donutChartConfig);

    this.platformSummaryDonutsConfig.donutChartHolder = element;
    this.platformSummaryDonutsConfig.showLeftLenend = true;

    const platformSummaryDonutsConfig = DonutChartConfig.from(this.platformSummaryDonutsConfig);

    this.platformSummaryDonuts.setConfig(platformSummaryDonutsConfig).datum(this.loadSummary);

    this.platformSummaryDonuts.draw();
  }


  fetchData() {
    console.log(this.abstractService);

    this.abstractService.getQuantitySummary().subscribe(response => {
      this.quantitySummary = response;
      console.log(this.quantitySummary);
    });

    this.abstractService.getLoadSummary(response => {
      this.loadSummary = response;
      this.drawPlatformSummaryDonuts();
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
          this.drawPlatformSummaryDonuts();
          // draw other charts
        });
    });
  }

}
