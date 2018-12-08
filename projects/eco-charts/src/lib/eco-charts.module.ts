import { NgModule } from '@angular/core';
import { EcoChartsComponent } from './eco-charts.component';

import {
  DonutChart,
  DonutChartData,
  DonutChartConfig,
  DonutChartDataBuilder,
} from './donut';

@NgModule({
  declarations: [EcoChartsComponent],
  imports: [
  ],
  exports: [EcoChartsComponent]
})
export class EcoChartsModule { }
