import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '../i18n';
import { TuiModule } from 'tdc-ui';

import {
  ImgSrcDirective,
} from './img';


@NgModule({
  imports: [
    CommonModule,
    TuiModule,
  ],
  declarations: [
    ImgSrcDirective,
  ],
  exports: [
    ImgSrcDirective,
    TuiModule,
  ],
})
export class SharedModule { }
