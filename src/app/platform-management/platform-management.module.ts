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
import { SystemModule } from './system/system.module';
import { NetworkComponent } from './network/network.component';
import { NetworkService } from './network/network.service';
import { DetailsComponent } from './network/details/details.component';
import { DataComponent } from './data/data.component';
import { DataService } from './data/data.service';
import { EditComponent } from './edit/edit.component';
import { EditService } from './edit/edit.service';
import { ShareComponent } from './data/share/share.component';

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
    SystemModule
  ],
  declarations: [
    PlatformManagementComponent,
    NetworkComponent,
    DetailsComponent,
    DataComponent,
    EditComponent,
    ShareComponent
  ],
  entryComponents: [
    EditComponent,
    ShareComponent
  ],
  exports: [
    PlatformManagementComponent
  ],
  providers: [
    TranslateService,
    TuiModalService,
    NetworkService,
    DataService,
    EditService
  ]
})
export class PlatformManagementModule { }
