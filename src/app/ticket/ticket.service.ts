import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TecApiService } from '../shared';
import { TicketFilter, Ticket } from './ticket.model';

@Injectable()
export class TicketService {

  constructor(private api: TecApiService) { }

  getTickets(filter?: TicketFilter): Observable<any> {
    return this.api.get(`tickets`, {...filter});
  }

  getTheTicket(ticketId: string): Observable<Ticket> {
    return this.api.get(`tickets/${ticketId}`, {}); // , {fullResponse: false}
  }

  updateTheTicket(param: any): Observable<any> {
    return this.api.post(`tickets/${param.ticketId}/operation`,
      {...param.followUpEntity} );
    }
    // {fullResponse: true});

  getTicketsServiceTypes(): Observable<any> {
    return this.api.getUnformat(`tickets/serviceTypes`, {}); // , {fullResponse: true}
  }

  getAttachment(ticketId, name) {
    return this.api.getFile(`tickets/${ticketId}/downloadAttachment`, {
      fileName: name,
    });
  }

}
