import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { TenantRoutingModule } from './tenant-routing.module';
import { TenantComponent } from './tenant.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TenantRoutingModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [TenantComponent],
})
export class TenantModule { }
