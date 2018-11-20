import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideRoutes, Routes } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { FormsModule } from '@angular/forms';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { Observable } from 'rxjs';
import { TranslatePipeStub, TranslateServiceMock } from '../../mock';

import { TranslateDeactivator, TranslateResolver, TranslateToken } from '../../i18n';
import {
  advance, createRoot,
  BlankComponent, RootComponent,
} from '../../shared/test';
import { SharedModule, TecApiService } from '../../shared';
import { TranslateService, I18nModule } from '../../i18n';
// import { ConfirmComponent } from '../confirm/confirm.component';
import { TicketComponent } from '../ticket.component';
import { TicketDetailsComponent } from './ticket-details.component';
// import { ticketRoutes } from '../ticket-routing.module';
import { TicketService } from '../ticket.service';
import { TuiModule, TuiModalService, TuiMessageService } from 'tdc-ui';
import { TicketServiceStub } from '../ticket.service.stub';
const ticketRoutes: Routes = [
  {
    path: '',
    component: BlankComponent,
  },
  {
    path: 'detail/:id',
    component: TicketDetailsComponent,
    resolve: [TranslateResolver],
    canDeactivate: [TranslateDeactivator],
  },
];

describe('TicketDetailsComponent', () => {
  let originalTime;
  let component: TicketDetailsComponent;
  let fixture: ComponentFixture<TicketDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],

      imports: [
        FormsModule,
        {
          ngModule: RouterTestingModule,
          providers: [provideRoutes(ticketRoutes)],
        },
        I18nModule,
        SharedModule,
      ],
      declarations: [
        TicketDetailsComponent,
        BlankComponent,
        TranslatePipeStub,
      ],
      providers: [
        {
          provide: TicketService,
          useFactory: (api: TecApiService) => {
            return new TicketServiceStub(api);
          },
          deps: [TecApiService],
        },
        TecApiService,
        {
          provide: TuiMessageService,
          useValue: {
            warning() {
              return () => {};
            },
          },
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        MockBackend,
        BaseRequestOptions,
        {
          provide: TuiModalService,
          useValue: {
            open() {
              return function(res) {};
            },
          },
        },
        { provide: Http,
          useFactory: (backend: ConnectionBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    originalTime = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    fixture = TestBed.createComponent(TicketDetailsComponent);
    component = fixture.componentInstance;
    component.getRouterParams = () => {
      return false;
    };
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTime;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
