import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { SystemRoutingModule } from './system-routing.module';
import { SystemComponent } from './system.component';

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
  ],
})
export class SystemModule { }
