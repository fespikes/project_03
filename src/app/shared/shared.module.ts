import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { I18nModule } from '../i18n';
import { TuiModule } from 'tdc-ui';

import {
  ImgSrcDirective,
  IconStatusDirective,
  ChartWrapperComponent,
} from './components/';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiModule,
  ],
  declarations: [
    ImgSrcDirective,
    IconStatusDirective,
    ChartWrapperComponent,
  ],
  exports: [
    ImgSrcDirective,
    IconStatusDirective,
    ChartWrapperComponent,
    TuiModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule { }
