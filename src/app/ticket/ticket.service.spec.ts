import { TestBed, inject } from '@angular/core/testing';
import { SharedModule, TecApiService } from '../shared';
import { MockBackend } from '@angular/http/testing';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { TranslateService } from '../i18n';
import { TicketServiceStub } from './ticket.service.stub';
import { TicketService } from './ticket.service';

describe('TicketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TicketService,
          useClass: TicketServiceStub,
        },
        MockBackend,
        BaseRequestOptions,
        TecApiService,
        { provide: Http,
          useFactory: (backend: ConnectionBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ],
    });
  });

  it('should be created', inject([TicketService], (service: TicketService) => {
    expect(service).toBeTruthy();
  }));
});
