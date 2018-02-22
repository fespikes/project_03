import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccounRoutingModule } from './accoun-routing.module';
import { AccountComponent } from './account.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';
import { LoginComponent } from './login/login.component';
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
    LoginComponent,
  ],
  providers: [
    AccountService,
  ],
})
export class AccountModule { }
