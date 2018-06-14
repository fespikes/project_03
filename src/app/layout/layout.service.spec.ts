import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
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
      ],
      providers: [
        LayoutService,
        TecApiService,
        BaseRequestOptions,
        MockBackend,
        { provide: Http,
          useFactory: (backend: ConnectionBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        TuiMessageService,
      ],
    });
  });

  it('should be created', inject([LayoutService], (service: LayoutService) => {
    expect(service).toBeTruthy();
  }));
});
