import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { NodeComponent } from './node.component';
import { StorageComponent } from './storage/storage.component';

const nodeRoutes: Routes = [
  {
    path: '',
    component: NodeComponent,
  },
  {
    path: 'storage/:name',
    component: StorageComponent
  },
  {
    path: 'storage/:name/pool',
    component: StorageComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: [TranslateResolver],
        // component: NodeComponent,
        canDeactivate: [TranslateDeactivator],
        children: nodeRoutes
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
