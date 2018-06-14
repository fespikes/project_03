import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { Overlay } from '@angular/cdk/overlay';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TenantAdminComponent } from './tenant-admin.component';
import { TenantService } from '../tenant.service';
import { TranslateService } from 'app/i18n';
import { Pagination, TuiModalService, TuiModalRef, TuiMessageService } from 'tdc-ui';

import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import TenantServiceStub from '../tenant.service.stub';
import { SharedModule, TecApiService } from '../../shared';

describe('TenantAdminComponent', () => {
  let originalTime: any;
  let component: TenantAdminComponent;
  let fixture: ComponentFixture<TenantAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,

      ],
      declarations: [
        TenantAdminComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],
      providers: [
        Overlay,
        {
          provide: TenantService,
          useFactory: () => {
            return new TenantServiceStub();
          },
        },
        TuiModalService,
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
    originalTime = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    fixture = TestBed.createComponent(TenantAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTime;
  });
});

