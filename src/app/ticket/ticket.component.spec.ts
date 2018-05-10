import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideRoutes, Routes } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import {
  advance, createRoot,
  BlankComponent, RootComponent,
} from '../shared/test';
import { SharedModule, TecApiService } from '../shared';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { TranslateService, I18nModule } from '../i18n';

import { TicketComponent } from './ticket.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ticketRoutes } from './ticket-routing.module';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { TicketServiceStub } from './ticket.service.stub';
import { TicketService } from './ticket.service';

describe('TicketComponent', () => {
  let component: TicketComponent;
  let fixture: ComponentFixture<TicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],

      imports: [
        {
          ngModule: RouterTestingModule,
          providers: [provideRoutes(ticketRoutes)],
        },
        SharedModule,
        I18nModule,
      ],
      declarations: [
        TicketComponent,
        TicketDetailsComponent,
        ConfirmComponent,
        // BlankComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],
      providers: [
        {
          provide: TicketService,
          useClass: TicketServiceStub,
        },
        TecApiService,
        MockBackend,
        BaseRequestOptions,
        { provide: Http,
          useFactory: (backend: ConnectionBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        {
          provide: TranslateService,
          useValue: {
            get() {
              return Observable.of();
            },
            translateKey() {},
          },
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
