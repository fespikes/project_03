import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { OverlayModule } from '@angular/cdk/overlay';

import { TenantNetworkComponent } from './tenant-network.component';
import { TranslatePipeStub } from 'app/mock';
import { TecApiService } from '../../../shared';
import { TenantService } from '../../tenant.service';
import { TuiMessageService } from 'tdc-ui';

describe('TenantNetworkComponent', () => {
  let component: TenantNetworkComponent;
  let fixture: ComponentFixture<TenantNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        OverlayModule,
        HttpClientModule,
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
        HttpClient,
        TuiMessageService,
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
