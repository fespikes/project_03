import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { NotFoundComponent } from './not-found.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [NotFoundComponent],
})
export class NotFoundModule { }
