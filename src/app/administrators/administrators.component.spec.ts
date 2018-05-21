import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SharedModule } from '../shared';
import { TranslateService } from '../i18n';
import { TuiModalService } from 'tdc-ui';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { AdministratorsComponent } from './administrators.component';
import { AdministratorsService } from './administrators.service';
import { TecApiService } from '../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


export class AdministratorsServiceStub {
  fetchAdministrators(filter?: any): Observable<any> {
    return Observable.of({
      paginations: {
        page: 1,
        size: 10,
        total: 20,
      },
    });
  }

  addAdministrator(params) {
    return Observable.of({});
  }
  deleteAdministrator(id: number) {
    return Observable.of({});
  }

}

describe('AdministratorsComponent', () => {
  let component: AdministratorsComponent;
  let fixture: ComponentFixture<AdministratorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        AdministratorsComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],
      providers: [
        {
          provide: AdministratorsService,
          useFactory: () => {
            return new AdministratorsServiceStub();
          },
        },
        TuiModalService,
        TecApiService,
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        },
        MockBackend,
        BaseRequestOptions,
        TuiModalService,
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
    fixture = TestBed.createComponent(AdministratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
