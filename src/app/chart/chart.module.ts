import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiModule } from 'tdc-ui';

import { I18nModule } from 'app/i18n';

import { ChartRoutingModule } from './chart-routing.module';
import { ChartExampleComponent } from './chart-example.component';
import { LineChartExampleComponent } from './line-chart-example/line-chart-example.component';
import { BarChartExampleComponent } from './bar-chart-example/bar-chart-example.component';
import { DonutChartExampleComponent } from './donut-chart-example/donut-chart-example.component';
import { BarTimeChartExampleComponent } from './bar-time-chart-example/bar-time-chart-example.component';
import { LineChartComponent, BarChartComponent, BarTimeChartComponent } from './chart/chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TuiModule,
    I18nModule,
    ChartRoutingModule,
  ],
  declarations: [
    ChartExampleComponent,
    LineChartExampleComponent,
    BarChartExampleComponent,
    DonutChartExampleComponent,
    BarTimeChartExampleComponent,
    LineChartComponent,
    BarChartComponent,
    BarTimeChartComponent,
  ],
})
export class ChartModule { }
