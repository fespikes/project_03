import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TecApiService } from '../shared';
import { TicketFilter, Ticket } from './ticket.model';

@Injectable()
export class TicketServiceStub {
  constructor(private api: TecApiService) { }

  getTickets(filter?: TicketFilter): Observable<any> {
    return Observable.of({
      pagination: {},
    });
  }

  getTheTicket(ticketId: string): Observable<Ticket> {
    return Observable.of(new Ticket());
  }

  updateTheTicket(param: any): Observable<any> {
    return Observable.of({});
  }

}
