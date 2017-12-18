import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiModule } from 'tdc-ui';

import { I18nModule } from 'app/i18n';

import { ChartRoutingModule } from './chart-routing.module';
import { ChartComponent } from './chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';

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
  ],
})
export class ChartModule { }
