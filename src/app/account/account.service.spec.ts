import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import * as path from 'path';

import { environment } from '../../environments/environment';

import { TecApiService } from '../shared';
import { AccountService } from './account.service';

const response: any = {
  'data': {},
  'message': 'reset succeed',
  'resultCode': '200',
};
// const response: any = {
//   body: `{
//     'data': {},
//     'message': 'reset succeed',
//     'resultCode': '200',
//   }`,
// };

describe('AccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountService,
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
      ],
    });
  });

  const makeUrl = (url) => {
    return path.join(environment.apiUrl, url);
  };

  function expectURL(url: string, backend: MockBackend) {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe(url);

      c.mockRespond(new Response(<any>{body: response}));
    });
  }

  it('should be created', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));


});
