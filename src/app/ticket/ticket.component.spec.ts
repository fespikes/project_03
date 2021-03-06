import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideRoutes, Routes } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import {
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { Observable, of } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';

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
  let originalTimeout;
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
        HttpClient,
        {
          provide: TicketService,
          useFactory: (api: TecApiService) => {
            return new TicketServiceStub(api);
          },
          deps: [TecApiService],
        },
        TecApiService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: TranslateService,
          useValue: {
            get() {
              return of();
            },
            translateKey() {},
          },
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;

    fixture = TestBed.createComponent(TicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
