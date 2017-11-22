import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { OrganizationComponent } from './organization.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OrganizationComponent,
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
      useValue: 'organization',
    },
  ],
})
export class OrganizationRoutingModule { }
