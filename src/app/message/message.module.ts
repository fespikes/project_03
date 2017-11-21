import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { MessageRoutingModule } from './message-routing.module';
import { MessageComponent } from './message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessageRoutingModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [
    MessageComponent,
  ],
})
export class MessageModule { }
