import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Observable } from 'rxjs';
import { TenantService } from '../../tenant.service';
import { TranslateService } from 'app/i18n';
import { Pagination, TuiModalService, TuiModalRef, TuiMessageService } from 'tdc-ui';

import TenantServiceStub from '../../tenant.service.stub';
import { SharedModule, TecApiService } from '../../../shared';
import { SendRegisterLinkComponent } from './send-register-link.component';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';

describe('SendRegisterLinkComponent', () => {
  let component: SendRegisterLinkComponent;
  let fixture: ComponentFixture<SendRegisterLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        // RouterTestingModule,
      ],
      declarations: [
        SendRegisterLinkComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],
      providers: [
        {
          provide: TenantService,
          useFactory: () => {
            return new TenantServiceStub();
          },
        },
        TecApiService,
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        },
        MockBackend,
        BaseRequestOptions,
        TuiModalRef,
        TuiModalService,
        TuiMessageService,
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
    fixture = TestBed.createComponent(SendRegisterLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
