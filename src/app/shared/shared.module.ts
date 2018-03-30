import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { I18nModule } from '../i18n';
import { TuiModule } from 'tdc-ui';

import {
  ChartWrapperComponent,
  CopyButtonComponent,
  ImgSrcDirective,
  IconStatusDirective,
  EditComponent,
  ModalImageDetailComponent,
  ModalPodDetailComponent,
  ModalYamlDetailComponent,
  OverflowContainerComponent,
  ServiceTagComponent,
  YamlTreeComponent,
} from './components/';

import {
  SystemService,
  SystemModalService,
} from './components';

@NgModule({
  imports: [
    I18nModule,
    CommonModule,
    FormsModule,
    I18nModule,
    ReactiveFormsModule,
    TuiModule,
  ],
  declarations: [
    ChartWrapperComponent,
    CopyButtonComponent,
    ImgSrcDirective,
    IconStatusDirective,
    EditComponent,
    ModalImageDetailComponent,
    ModalPodDetailComponent,
    ModalYamlDetailComponent,
    OverflowContainerComponent,
    ServiceTagComponent,
    YamlTreeComponent,
  ],
  providers: [
    SystemService,
    SystemModalService,
  ],
  exports: [
    ChartWrapperComponent,
    EditComponent,
    TuiModule,
    CopyButtonComponent,
    FormsModule,
    ImgSrcDirective,
    IconStatusDirective,
    I18nModule,
    ModalImageDetailComponent,
    ModalPodDetailComponent,
    ModalYamlDetailComponent,
    OverflowContainerComponent,
    ReactiveFormsModule,
    ServiceTagComponent,
    TuiModule,
    YamlTreeComponent,
  ],
  entryComponents: [
    ModalPodDetailComponent,
    ModalImageDetailComponent,
    ModalYamlDetailComponent,
  ],
})
export class SharedModule { }
