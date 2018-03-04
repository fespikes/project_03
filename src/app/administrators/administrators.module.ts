import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiModalService } from 'tdc-ui';

import { SharedModule } from '../shared';
import { I18nModule, TranslateService } from '../i18n';

import { AdministratorsRoutingModule } from './administrators-routing.module';
import { AdministratorsComponent } from './administrators.component';
import { AddComponent } from './add/add.component';
import { AdministratorsService } from './administrators.service';

@NgModule({
  imports: [
    CommonModule,
    AdministratorsRoutingModule,
    I18nModule,
    SharedModule,
  ],
  declarations: [
    AdministratorsComponent,
    AddComponent,
  ],
  providers: [
    AdministratorsService,
    TranslateService,
    TuiModalService,
  ],
  entryComponents: [
    AddComponent,
  ],
})
export class AdministratorsModule { }
