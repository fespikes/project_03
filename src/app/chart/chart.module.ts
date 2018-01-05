import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiModule } from 'tdc-ui';

import { I18nModule } from 'app/i18n';

import { ChartRoutingModule } from './chart-routing.module';
import { ChartComponent } from './chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { BarTimeChartComponent } from './bar-time-chart/bar-time-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TuiModule,
    I18nModule,
    ChartRoutingModule,
  ],
  declarations: [
    ChartComponent,
    LineChartComponent,
    BarChartComponent,
    DonutChartComponent,
    BarTimeChartComponent,
  ],
})
export class ChartModule { }
