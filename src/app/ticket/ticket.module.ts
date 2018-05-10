import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { TicketRoutingModule } from './ticket-routing.module';
import { TicketComponent } from './ticket.component';
import { TicketService } from './ticket.service';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { ConfirmComponent } from './confirm/confirm.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TicketRoutingModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [
    TicketComponent,
    TicketDetailsComponent,
    ConfirmComponent,
  ],
  entryComponents: [
    ConfirmComponent,
  ],
  providers: [
    TicketService,
  ],
})
export class TicketModule { }
