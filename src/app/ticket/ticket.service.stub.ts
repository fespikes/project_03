import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { TecApiService } from '../shared';
import { TicketFilter, Ticket } from './ticket.model';

@Injectable()
export class TicketServiceStub {
  constructor(private api: TecApiService) { }

  getTickets(filter?: TicketFilter): Observable<any> {
    return of({
      pagination: {},
    });
  }

  getTheTicket(ticketId: string): Observable<Ticket> {
    return of(new Ticket());
  }

  updateTheTicket(param: any): Observable<any> {
    return of({});
  }

  getTicketsServiceTypes(): Observable<any> {
    return of([]);
  }

  getAttachment(ticketId, name) {
    return of({});
  }
}
