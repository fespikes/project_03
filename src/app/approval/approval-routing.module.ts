import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { ApprovalComponent } from './approval.component';
import { TaskComponent } from './task/task.component';

const ApprovalRoutes: Routes = [
  {
    path: '',
    component: ApprovalComponent
  },
  {
    path: 'task',
    component: TaskComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        resolve: [TranslateResolver],
        canDeactivate: [TranslateDeactivator],
        children: ApprovalRoutes,
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
      useValue: 'approval',
    },
  ]
})
export class ApprovalRoutingModule { }
