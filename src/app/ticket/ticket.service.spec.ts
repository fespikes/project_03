import { TestBed, inject } from '@angular/core/testing';
import { TecApiService } from '../shared';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';

import { TuiMessageService } from 'tdc-ui';

import { TicketServiceStub } from './ticket.service.stub';
import { TicketService } from './ticket.service';

describe('TicketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        HttpClientModule,
      ],
      providers: [
        TuiMessageService,
        {
          provide: TicketService,
          useClass: TicketServiceStub,
        },
        MockBackend,
        BaseRequestOptions,
        TecApiService,
      ],
    });
  });

  it('should be created', inject([TicketService], (service: TicketService) => {
    expect(service).toBeTruthy();
  }));
});
