import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { Observable } from 'rxjs';

import { TuiModalService, TuiModalRef, TuiMessageService } from 'tdc-ui';

import { SharedModule, TecApiService } from '../../../shared';
import { AddComponent } from './add.component';
import { TranslateService } from '../../../i18n';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import TenantServiceStub from '../../tenant.service.stub';

import { TenantService } from '../../tenant.service';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

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
        AddComponent,
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
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
