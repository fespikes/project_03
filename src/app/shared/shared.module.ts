import { NgModule } from '@angular/core';
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
    TuiModule,
  ],
  declarations: [
    ImgSrcDirective,
    IconStatusDirective,
    // ChartWrapperComponent,
  ],
  exports: [
    ImgSrcDirective,
    IconStatusDirective,
    TuiModule,
  ],
})
export class SharedModule { }
