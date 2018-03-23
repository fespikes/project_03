import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { I18nModule } from '../i18n';
import { TuiModule } from 'tdc-ui';

import {
  ImgSrcDirective,
  IconStatusDirective,
  ChartWrapperComponent,
  EditComponent,
} from './components/';

@NgModule({
  imports: [
    I18nModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiModule,
  ],
  declarations: [
    ImgSrcDirective,
    IconStatusDirective,
    ChartWrapperComponent,
    EditComponent,
  ],
  exports: [
    ImgSrcDirective,
    IconStatusDirective,
    ChartWrapperComponent,
    EditComponent,
    TuiModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule { }
