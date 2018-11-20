import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
  Routes,
  provideRoutes,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import { Observable, of } from 'rxjs';

import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { TecApiService, SharedModule } from 'app/shared';
import { NetworkRulesComponent } from './network-rules.component';
import { TenantService } from '../../../tenant.service';
import { TranslateService, I18nLangService } from 'app/i18n';
import {
  TuiModalService,
  TableModule,
} from 'tdc-ui';

class TenantServiceStub {
  public get networks(): string {
    return JSON.stringify([]);
  }
  getSecurityRules() {
    return of({
      data: [],
      pagination: {},
    });
  }
}

describe('NetworkRulesComponent', () => {
  let component: NetworkRulesComponent;
  let fixture: ComponentFixture<NetworkRulesComponent>;
  let originalTime: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
      ],
      declarations: [
        NetworkRulesComponent,
        DefaultPipeStub,
        TranslatePipeStub,
      ],
      providers: [
        MockBackend,
        BaseRequestOptions,
        TecApiService,
        TenantServiceStub,
        {
          provide: TenantService,
          useFactory: (stub: TenantServiceStub) => {
            return new TenantServiceStub();
          },
          deps: [TenantServiceStub],
        },
        {
          provide: ActivatedRoute,
          useFactory: (r: Router) => r.routerState.root,
          deps: [ Router ],
        },
        {
          provide: Http, useFactory: (
            backend: ConnectionBackend,
            defaultOptions: BaseRequestOptions,
          ) => {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions],
        },
        TranslateService,
        I18nLangService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    originalTime = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;

    fixture = TestBed.createComponent(NetworkRulesComponent);
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
