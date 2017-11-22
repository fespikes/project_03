import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { TicketComponent } from './ticket.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TicketComponent,
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
