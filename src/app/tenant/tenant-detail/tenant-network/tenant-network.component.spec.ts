import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';

import { TenantNetworkComponent } from './tenant-network.component';
import { TranslatePipeStub } from 'app/mock';
import { TecApiService } from '../../../shared';
import { TenantService } from '../../tenant.service';

describe('TenantNetworkComponent', () => {
  let component: TenantNetworkComponent;
  let fixture: ComponentFixture<TenantNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        TenantNetworkComponent,
        TranslatePipeStub,
      ],
      providers: [
        MockBackend,
        BaseRequestOptions,
        TecApiService,
        TenantService,
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
    fixture = TestBed.createComponent(TenantNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
