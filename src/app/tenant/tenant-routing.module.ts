import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { TenantComponent } from './tenant.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TenantComponent,
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
      useValue: 'tenant',
    },
  ],
})
export class TenantRoutingModule { }
