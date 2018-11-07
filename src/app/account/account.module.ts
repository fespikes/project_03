import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { I18nModule, TranslateService } from '../i18n';
import { TuiModalRef } from 'tdc-ui';

import { AccounRoutingModule } from './accoun-routing.module';
import { AccountComponent } from './account.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';
import { AccountService } from './account.service';
import { LicenseComponent } from './license/license.component';
import { UploadComponent } from './license/upload/upload.component';
import { FileUploadDirective } from '../shared';

@NgModule({
  imports: [
    CommonModule,
    AccounRoutingModule,
    I18nModule,
    SharedModule,
  ],
  declarations: [
    AccountComponent,
    ChangePwdComponent,
    LicenseComponent,
    UploadComponent,
    FileUploadDirective
  ],
  providers: [
    TuiModalRef,
    AccountService,
    TranslateService,
  ],
  entryComponents: [
    UploadComponent
  ]
})
export class AccountModule { }
