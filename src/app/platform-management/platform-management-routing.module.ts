import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';

import { PlatformManagementComponent } from './platform-management.component';
import { DetailsComponent } from './network/details/details.component';

const platformManagementRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: PlatformManagementComponent
  },
  {
    path: 'detail/:name',
    component: DetailsComponent
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
  exports: [
    RouterModule
  ],
  providers: [
    TranslateResolver,
    TranslateDeactivator,
    {
      provide: TranslateToken,
      useValue: 'platformManagement',
    }
  ]
})
export class PlatformManagementRoutingModule { }
