import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { NodeComponent } from './node.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: NodeComponent,
        resolve: [TranslateResolver],
        canDeactivate: [TranslateDeactivator],
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
      useValue: 'node',
    },
  ],
})
export class NodeRoutingModule { }
