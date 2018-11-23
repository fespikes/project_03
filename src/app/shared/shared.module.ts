import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { I18nModule } from '../i18n';
import { TuiModule } from 'tdc-ui';

import {
  ForbiddenValidatorDirective
} from './directives';

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
  AddComponent
} from './components';

import {
  SystemService,
  SystemModalService,
} from './components';

@NgModule({
  imports: [
    I18nModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiModule,
    HttpClientModule,
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

    ForbiddenValidatorDirective,
    AddComponent
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
    HttpClientModule,

    ForbiddenValidatorDirective,
    AddComponent
  ],
  entryComponents: [
    ModalPodDetailComponent,
    ModalImageDetailComponent,
    ModalYamlDetailComponent,
    AddComponent
  ],
})
export class SharedModule { }
