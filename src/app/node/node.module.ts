import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { NodeRoutingModule } from './node-routing.module';
import { NodeComponent } from './node.component';

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
  ],
})
export class NodeModule { }
