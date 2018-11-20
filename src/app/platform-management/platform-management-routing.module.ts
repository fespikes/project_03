import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';

import { PlatformManagementComponent } from './platform-management.component';

const platformManagementRoutes: Routes = [
  {
    path: '',
    component: PlatformManagementComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: [TranslateResolver],
        canDeactivate: [TranslateDeactivator],
        children: platformManagementRoutes
      }
    ])
  ],
  exports: [RouterModule],
  providers: [
    TranslateResolver,
    TranslateDeactivator,
    {
      provide: TranslateToken,
      useValue: 'platformManagement',
    },
  ],
})
export class PlatformManagementRoutingModule { }
