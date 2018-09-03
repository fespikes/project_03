import { TestBed, inject } from '@angular/core/testing';
import { SharedModule, TecApiService } from '../shared';
import { MockBackend } from '@angular/http/testing';
import {
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { OverlayModule } from '@angular/cdk/overlay';

import { Observable } from 'rxjs/Observable';
import { TuiMessageService } from 'tdc-ui';

import { TasksService } from './tasks.service';
import { TranslateService } from '../i18n';

describe('TasksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        HttpClientModule,
      ],
      providers: [
        TuiMessageService,
        MockBackend,
        BaseRequestOptions,
        TasksService,
        TecApiService,
        HttpClient,
        {
          provide: TranslateService,
          useValue: {
            get() {
              return Observable.of();
            },
          },
        },
      ],
    });
  });

  it('should be created', inject([TasksService], (service: TasksService) => {
    expect(service).toBeTruthy();
  }));
});
