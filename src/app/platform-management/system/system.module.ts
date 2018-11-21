import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared';
import { I18nModule, TranslateService } from 'app/i18n';
import { TuiModalService } from 'tdc-ui';

import { SystemComponent } from './system.component';
import { SystemModuleService } from './system.service';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [
    SystemComponent,
    EditComponent,
  ],
  exports: [
    SystemComponent
  ],
  providers: [
    TuiModalService,
    TranslateService,
    SystemModuleService,
  ],
})
export class SystemModule { }
