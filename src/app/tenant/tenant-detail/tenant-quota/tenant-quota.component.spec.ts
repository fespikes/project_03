import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TecUtilService } from '../../../shared';
import { TuiMessageService } from 'tdc-ui';
import { MockBackend } from '@angular/http/testing';
import { TenantQuotaComponent } from './tenant-quota.component';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { TenantService } from '../../tenant.service';
import { TecApiService } from '../../../shared';
import { TranslateServiceMock, TecUtilServiceMock } from 'app/mock';
import { TranslateService } from 'app/i18n';

describe('TenantQuotaComponent', () => {
  let component: TenantQuotaComponent;
  let fixture: ComponentFixture<TenantQuotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        DefaultPipeStub,
        TenantQuotaComponent,
        TranslatePipeStub,
      ],
      providers: [
        HttpClient,
        TenantService,
        TecApiService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        { provide: Http,
          useFactory: (
            backend: ConnectionBackend,
            defaultOptions: BaseRequestOptions,
          ) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        TuiMessageService,
        {
          provide: TecUtilService,
          useClass: TecUtilServiceMock
        }
      ],
      imports: [
        HttpClientModule,
        OverlayModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
