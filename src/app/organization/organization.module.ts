import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationComponent } from './organization.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OrganizationRoutingModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [
    OrganizationComponent,
  ],
})
export class OrganizationModule { }
