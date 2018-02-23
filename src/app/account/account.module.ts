import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TuiModalRef } from 'tdc-ui';

import { AccounRoutingModule } from './accoun-routing.module';
import { AccountComponent } from './account.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';
import { AccountService } from './account.service';

@NgModule({
  imports: [
    CommonModule,
    AccounRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AccountComponent,
    ChangePwdComponent,
  ],
  providers: [
    TuiModalRef,
    AccountService,
  ],
})
export class AccountModule { }
