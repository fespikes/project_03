import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '../i18n';
import { FormsModule } from '@angular/forms';

import { TuiModule, TuiModalService } from 'tdc-ui';

import { SharedModule, TecApiService } from '../shared';
import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksService } from './tasks.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    I18nModule,
    TuiModule,
    SharedModule,
    TasksRoutingModule,
  ],
  declarations: [
    TasksComponent,
  ],
  providers: [
    TuiModalService,
    TasksService,
    TecApiService,
  ],
  entryComponents: [
  ],
})
export class TasksModule { }
