import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { TenantDetailComponent } from './tenant-detail/tenant-detail.component';

const tanantChildren = [
  {
    path: '',
    redirectTo: 'overview',
  },
  {
    path: 'detail',
    component: TenantDetailComponent,
  },
  {
    path: 'overview',
    component: TenantListComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: [TranslateResolver],
        canDeactivate: [TranslateDeactivator],
        children: tanantChildren,
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
      useValue: 'tenant',
    },
  ],
})
export class TenantRoutingModule { }
