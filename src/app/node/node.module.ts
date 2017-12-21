import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiModalService } from 'tdc-ui';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { NodeRoutingModule } from './node-routing.module';
import { NodeComponent } from './node.component';
import { NodeAsideComponent } from './node-aside/node-aside.component';

import { NodeService } from './node.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NodeRoutingModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [
    NodeComponent,
    NodeAsideComponent,
  ],
  providers: [
    NodeService,
    TuiModalService,
  ],
})
export class NodeModule { }
