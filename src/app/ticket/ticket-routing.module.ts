import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { TicketComponent } from './ticket.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';

export const ticketRoutes: Routes = [
  {
    path: '',
    component: TicketComponent,
  },
  {
    path: 'detail/:id',
    component: TicketDetailsComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: ticketRoutes,
        resolve: [TranslateResolver],
        canDeactivate: [TranslateDeactivator],
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    TranslateResolver,
    TranslateDeactivator,
    {
      provide: TranslateToken,
      useValue: 'ticket',
    },
  ],
})
export class TicketRoutingModule { }
