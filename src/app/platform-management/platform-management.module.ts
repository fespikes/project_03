import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  TuiModalService,
  TableModule,
  IconModule,
  BtnModule,
} from 'tdc-ui';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { PlatformManagementRoutingModule } from './platform-management-routing.module';
import { PlatformManagementComponent } from './platform-management.component';
import { NodeModule } from './node/node.module';

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
    PlatformManagementRoutingModule,

    NodeModule
  ],
  declarations: [
    PlatformManagementComponent,
  ]
})
export class PlatformManagementModule { }
