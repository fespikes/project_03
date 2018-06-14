import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { TranslatePipeStub, TranslateServiceMock } from '../../mock';
import { TuiModule, TuiModalService, TuiModalRef, TUI_MODAL_DATA, TuiMessageService } from 'tdc-ui';

import { SharedModule, TecApiService, TecUtilService } from '../../shared';
import { TranslateService, I18nModule } from '../../i18n';
import { ConfirmComponent } from './confirm.component';
import { TicketService } from '../ticket.service';
import { TicketFilter, Ticket } from '../ticket.model';
import { TicketServiceStub } from '../ticket.service.stub';

describe('ConfirmComponent', () => {
  let originalTime;
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nModule,
        TuiModule,
        SharedModule,
      ],
      declarations: [
        ConfirmComponent,
        TranslatePipeStub,
      ],
      providers: [
        TuiModalRef,
        TecUtilService,
        {
          provide: TUI_MODAL_DATA,
          useValue: {},
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        {
          provide: TicketService,
          useFactory: (api: TecApiService) => {
            return new TicketServiceStub(api);
          },
          deps: [TecApiService],
        },
        TecApiService,
        TuiMessageService,

        MockBackend,
        BaseRequestOptions,
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
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
    component.fields = {};
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTime;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
