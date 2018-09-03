import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
// import {
//   Http,
//   ConnectionBackend,
//   BaseRequestOptions,
//   Response,
//   ResponseOptions,
// } from '@angular/http';
import { TuiMessageService } from 'tdc-ui';
import { HttpClientModule } from '@angular/common/http';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayModule } from '@angular/cdk/overlay';

import * as path from 'path';

import { environment } from '../../environments/environment';

import { TecApiService } from '../shared';
import { AdministratorsService } from './administrators.service';

describe('AdministratorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        OverlayModule,
      ],
      providers: [
        AdministratorsService,
        TecApiService,
        // BaseRequestOptions,
        MockBackend,
        TuiMessageService,
        Overlay,
        /*{ provide: Http,
          useFactory: (backend: ConnectionBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },*/

      ],
    });
  });

  it('should be created', inject([AdministratorsService], (service: AdministratorsService) => {
    expect(service).toBeTruthy();
  }));
});
