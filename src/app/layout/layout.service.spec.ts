import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import {
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { OverlayModule } from '@angular/cdk/overlay';
import * as path from 'path';

import { TuiMessageService } from 'tdc-ui';
import { LayoutService } from './layout.service';
import { TecApiService } from '../shared';

describe('LayoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        HttpClientModule,
      ],
      providers: [
        LayoutService,
        TecApiService,
        BaseRequestOptions,
        MockBackend,
        TuiMessageService,
      ],
    });
  });

  it('should be created', inject([LayoutService], (service: LayoutService) => {
    expect(service).toBeTruthy();
  }));
});
