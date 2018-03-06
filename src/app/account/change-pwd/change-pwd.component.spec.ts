import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MockBackend } from '@angular/http/testing';
// import {
//   Http,
//   ConnectionBackend,
//   BaseRequestOptions,
//   Response,
//   ResponseOptions,
// } from '@angular/http';
import { HttpModule } from '@angular/http';

import { TuiModalRef } from 'tdc-ui';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { ChangePwdComponent } from './change-pwd.component';
import { AccountService } from '../account.service';
import { TecApiService } from '../../shared';

describe('ChangePwdComponent', () => {
  let component: ChangePwdComponent;
  let fixture: ComponentFixture<ChangePwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        TranslatePipeStub,
        DefaultPipeStub,
        ChangePwdComponent,
      ],
      providers: [
        TuiModalRef,
        AccountService,
        TecApiService,
        // { provide: Http,
        //   useFactory: (backend: ConnectionBackend,
        //                defaultOptions: BaseRequestOptions) => {
        //     return new Http(backend, defaultOptions);
        //   },
        //   deps: [MockBackend, BaseRequestOptions],
        // },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
