import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  TuiModalService,
  TableModule,
  IconModule,
  BtnModule,
} from 'tdc-ui';
import { TuiModalRef } from 'tdc-ui';

import { I18nModule } from '../i18n';
import { SharedModule } from '../shared';

import { ApprovalRoutingModule } from './approval-routing.module';
import { ApprovalComponent } from './approval.component';
import { PendingComponent } from './pending/pending.component';
import { FlowComponent } from './flow/flow.component';
import { ApprovalService } from './approval.service';
import { TaskComponent } from './task/task.component';
import { EditComponent } from './edit/edit.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    BtnModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    I18nModule,
    ApprovalRoutingModule
  ],
  declarations: [
    ApprovalComponent,
    PendingComponent,
    FlowComponent,
    TaskComponent,
    EditComponent,
    HistoryComponent
  ],
  entryComponents: [
    EditComponent
  ],
  providers: [
    ApprovalService,
    TuiModalRef
  ]
})
export class ApprovalModule { }
