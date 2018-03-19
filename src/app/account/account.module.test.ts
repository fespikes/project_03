import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../shared';

import { I18nModule, TranslateService } from '../i18n';
import { TuiModalRef } from 'tdc-ui';

import { AccounRoutingModule } from './accoun-routing.module';
import { AccountComponent } from './account.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';
import { AccountService } from './account.service';

import {
  TranslatePipeStub,
  DefaultPipeStub,
} from 'app/mock';
import {
  BlankComponent, RootComponent,
} from '../shared/test';

@NgModule({
  imports: [
    CommonModule,
    AccounRoutingModule,
    I18nModule,
    SharedModule,
  ],
  declarations: [
    BlankComponent, RootComponent,
  ],
  exports: [
    BlankComponent, RootComponent,
  ],
})
export class AccountModuleTest { }
