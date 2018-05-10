import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TecApiService } from '../shared';
import { TicketFilter, Ticket } from './ticket.model';

@Injectable()
export class TicketService {

  constructor(private api: TecApiService) { }

  getTickets(filter?: TicketFilter): Observable<any> {
    return this.api.get(`tickets`, {...filter});
  }

  getTheTicket(ticketId: string): Observable<Ticket> {
    return this.api.get(`tickets/${ticketId}`, {}, {fullResponse: false});
  }

  updateTheTicket(param: any): Observable<any> {
    return this.api.post(`tickets/${param.ticketId}/operation`, {...param.followUpEntity});
  }

}
