import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';
import { TuiModalService } from 'tdc-ui';
import { TranslateService } from '../i18n';

import { SystemRoutingModule } from './system-routing.module';
import { SystemComponent } from './system.component';
import { ServiceTagComponent } from './components/tag/service-tag.component';

import { SystemService } from './service/system.service';
import { ServiceDurationPipe } from './pipe/duration.pipe';

import {
  ModalPodDetailComponent,
  ModalImageDetailComponent,
  ModalYamlDetailComponent,
} from './modal';
import {
  CopyButtonComponent,
  YamlTreeComponent,
  OverflowContainerComponent,
} from './components';

import { SystemModalService } from './modal/system.modal.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SystemRoutingModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [
    SystemComponent,
    ServiceTagComponent,
    ServiceDurationPipe,
    ModalPodDetailComponent,
    ModalImageDetailComponent,
    ModalYamlDetailComponent,
    YamlTreeComponent,
    CopyButtonComponent,
    OverflowContainerComponent,
  ],
  providers: [
    SystemService,
    TuiModalService,
    TranslateService,
    SystemModalService,
  ],
  entryComponents: [
    ModalPodDetailComponent,
    ModalImageDetailComponent,
    ModalYamlDetailComponent,
  ],
})
export class SystemModule { }
