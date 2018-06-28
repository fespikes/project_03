import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { ChartExampleComponent } from './chart-example.component';
import { LineChartExampleComponent } from './line-chart-example/line-chart-example.component';
import { BarChartExampleComponent } from './bar-chart-example/bar-chart-example.component';
import { DonutChartExampleComponent } from './donut-chart-example/donut-chart-example.component';
import { BarTimeChartExampleComponent } from './bar-time-chart-example/bar-time-chart-example.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ChartExampleComponent,
        resolve: [TranslateResolver],
        canDeactivate: [TranslateDeactivator],
        children: [
          {
            path: '',
            redirectTo: 'line',
            pathMatch: 'prefix',
          },
          {
            path: 'line',
            component: LineChartExampleComponent,
          },
          {
            path: 'bar',
            component: BarChartExampleComponent,
          },
          {
            path: 'bartime',
            component: BarTimeChartExampleComponent,
          },
          {
            path: 'donut',
            component: DonutChartExampleComponent,
          },
        ],
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})
export class ChartRoutingModule { }
