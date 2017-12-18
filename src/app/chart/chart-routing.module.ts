import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { ChartComponent } from './chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ChartComponent,
        resolve: [TranslateResolver],
        canDeactivate: [TranslateDeactivator],
        children: [
          {
            path: 'line',
            component: LineChartComponent,
          },
        ],
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    TranslateResolver,
    TranslateDeactivator,
    {
      provide: TranslateToken,
      useValue: 'abstract',
    },
  ],
})
export class ChartRoutingModule { }
