import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { TasksComponent } from './tasks.component';

const taskRoutes: Routes = [
{
  path: '',
  component: TasksComponent,
  resolve: [TranslateResolver],
  canDeactivate: [TranslateDeactivator],
}];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(taskRoutes),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    TranslateResolver,
    TranslateDeactivator,
    {
      provide: TranslateToken,
      useValue: 'tasks',
    },
  ],
})
export class TasksRoutingModule { }
