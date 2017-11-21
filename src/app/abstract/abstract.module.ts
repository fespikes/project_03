import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { AbstractRoutingModule } from './abstract-routing.module';
import { AbstractComponent } from './abstract.component';

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
})
export class AbstractModule { }
