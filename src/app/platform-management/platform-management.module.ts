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
import { I18nModule, TranslateService } from '../i18n';

import { PlatformManagementRoutingModule } from './platform-management-routing.module';
import { PlatformManagementComponent } from './platform-management.component';
import { NodeModule } from './node/node.module';
import { NetworkComponent } from './network/network.component';
import { NetworkService } from './network/network.service';
import { DetailsComponent } from './network/details/details.component';
import { AddComponent } from './network/add/add.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    BtnModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    I18nModule,
    SharedModule,
    PlatformManagementRoutingModule,

    NodeModule,
  ],
  declarations: [
    PlatformManagementComponent,
    NetworkComponent,
    DetailsComponent,
    AddComponent
  ],
  entryComponents: [
    AddComponent
  ],
  exports: [
    PlatformManagementComponent
  ],
  providers: [
    TranslateService,
    TuiModalService,
    NetworkService
  ]
})
export class PlatformManagementModule { }
