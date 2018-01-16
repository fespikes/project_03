import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiModalService } from 'tdc-ui';

import { SharedModule } from '../shared';
import { I18nModule, TranslateService } from '../i18n';

import { AbstractRoutingModule } from './abstract-routing.module';
import { AbstractComponent } from './abstract.component';
import { AbstractService } from './abstract.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AbstractRoutingModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [
    AbstractComponent,
  ],
  providers: [
    AbstractService,
    TranslateService,
    TuiModalService,
  ],
})
export class AbstractModule { }
