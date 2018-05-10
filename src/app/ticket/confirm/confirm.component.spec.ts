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

import { TuiModule, TuiModalService, TuiModalRef, TUI_MODAL_DATA, TuiMessageService } from 'tdc-ui';

import { SharedModule, TecApiService } from '../../shared';
import { TranslateService, I18nModule } from '../../i18n';
import { ConfirmComponent } from './confirm.component';
import { TicketService } from '../ticket.service';
import { TranslatePipeStub } from '../../mock';

describe('ConfirmComponent', () => {
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
        {
          provide: TUI_MODAL_DATA,
          useValue: {},
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
        TicketService,
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
    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
    component.fields = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
