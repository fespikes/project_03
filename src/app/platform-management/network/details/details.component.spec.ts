import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';

import { TuiMessageService, TuiModalRef, TuiModalService } from 'tdc-ui';
import { NetworkService } from '../network.service';
import { TecApiService } from 'app/shared';
import { of } from 'rxjs';
import { TranslateService } from 'app/i18n/';

import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
        RouterTestingModule
      ],
      declarations: [
        DetailsComponent,
        TranslatePipeStub,
        DefaultPipeStub
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            paramMap: {
              pipe() {
                return of({});
              }
            }
          },
        },
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        },
        TuiModalRef,
        TuiMessageService,
        TecApiService,
        NetworkService,
        {
          provide: TuiModalService,
          useValue: {
            open() {
              return function(res) {};
            },
          },
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
