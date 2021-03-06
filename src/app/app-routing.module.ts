import { NgModule } from '@angular/core';

import {
  RouterModule,
  Routes,
  PreloadAllModules,
} from '@angular/router';

import {
  TranslateResolver,
  TranslateDeactivator,
  TranslateToken,
} from './i18n';

import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { environment } from '../environments/environment';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'abstract',
        loadChildren: './abstract/abstract.module#AbstractModule',
      },
      {
        path: 'tenant',
        loadChildren: './tenant/tenant.module#TenantModule',
      },
/*       {
        path: 'node',
        loadChildren: './node/node.module#NodeModule',
      }, */
/*       {
        path: 'system',
        loadChildren: './system/system.module#SystemModule',
      }, */
      {
        path: 'message',
        loadChildren: './message/message.module#MessageModule',
      },
      {
        path: 'organization',
        loadChildren: './organization/organization.module#OrganizationModule',
      },
      {
        path: 'chart',
        loadChildren: './chart/chart.module#ChartModule',
      },
      {
        path: 'administrators',
        loadChildren: './administrators/administrators.module#AdministratorsModule',
      },
      {
        path: 'account',
        loadChildren: './account/account.module#AccountModule',
      },
      {
        path: 'management',
        loadChildren: './platform-management/platform-management.module#PlatformManagementModule',
      },
      {
        path: 'tasks',
        loadChildren: './tasks/tasks.module#TasksModule',
      },
      {
        path: 'tickets',
        loadChildren: './ticket/ticket.module#TicketModule',
      },
      {
        path: '',
        redirectTo: 'abstract',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        resolve: [TranslateResolver],
        canDeactivate: [TranslateDeactivator],
        children: routes,
      },
    ], {
        useHash: true,
        preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    TranslateResolver,
    TranslateDeactivator,
    {
      provide: TranslateToken,
      useValue: 'common',
    },
  ],
})
export class AppRoutingModule { }
