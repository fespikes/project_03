import { Component, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { AbstractService } from './abstract.service';

const monthlyOptions = [
  'last month',
  'last 2 months',
  'last 3 months',
  'last 4 months',
  'last 5 months',
  'last 6 months',
  'last 7 months',
  'last 8 months',
  'last 9 months',
  'last 10 months',
  'last 11 months',
  'last 12 months',
];

const length = 12;
let result: any[] = [];
for (let i = length; i > 0; i--) {
  const str: string = i === 1 ? ('last ' + i + ' hour') : ('last ' + i + ' hours');
  result = [str].concat(result);
}
const hourOptions = result;

@Component({
  selector: 'tec-abstract',
  templateUrl: './abstract.component.html',
  styleUrls: ['./abstract.component.sass'],
})
export class AbstractComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  iconId: string;
  instancesAmountTrendOptions: string[] = [...monthlyOptions];
  instancesAmountTrendOption: string;
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
  quantitySummary: any;
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

  ngOnInit() {
    const iconSymbol = document.querySelector('tui-icon-symbol');
    const symbol = iconSymbol.querySelector('#clock');

    this.iconId = symbol.id;
    // TODO: get the icons work

    this.fetchData();
  }

  fetchData() {
    console.log(this.abstractService);

    this.abstractService.getQuantitySummary().subscribe(response => {
      this.quantitySummary = response;
      console.log(this.quantitySummary);
    });

    this.abstractService.getLoadSummary().subscribe(response => {
      this.loadSummary = response;
      // TODO: adapt the data to donut params
      console.log(this.loadSummary);
    });
  }

}
