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

import { TecApiService } from '../shared';
import { TecApiServiceMock } from '../shared/services/api.serviceMock';
import { makeUrl } from '../shared/test';
import { AccountService } from './account.service';
import { TuiMessageService } from 'tdc-ui';

const response: any = {
  'data': {},
  'message': 'reset succeed',
  'resultCode': '200',
};

describe('AccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseRequestOptions,
        MockBackend,
        { provide: Http,
          useFactory: (backend: ConnectionBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        AccountService,
        TecApiServiceMock,
        TuiMessageService,
        {
          provide: TecApiService,
          useFactory: (http: Http, message: TuiMessageService) => new TecApiServiceMock(http, message),
          deps: [Http, TuiMessageService],
        },
      ],
      imports: [
        OverlayModule,
      ],
    });
  });

  function expectURL(backend: MockBackend, url: string) {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe(url);

      c.mockRespond(new Response(<any>{body: response}));
    });
  }

  it('should be created', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));

  describe('changePWD', () => {
    it('retrieves using oldPassword and newPassword',
      inject([AccountService, MockBackend], fakeAsync((accountService, backend) => {
        let res;
        const requestUrl = makeUrl('admins/resetPassword');
        expectURL(backend, requestUrl);

        accountService.changePWD({
          oldpassword: 123,
          newpassword: 2345,
        }).subscribe(resp => {
          res = resp;
        });
        tick();

        expect(res.message).toBe('reset succeed');
      })));

    it('retrieves using oldPassword and newPassword',
      inject([AccountService, MockBackend], fakeAsync((accountService, backend) => {
        let res;
        const requestUrl = makeUrl('admins/resetPassword');
        expectURL(backend, requestUrl);

        accountService.changePWD({
          oldpassword: 123,
          newpassword: 2345,
        }).subscribe(resp => {
          res = resp;
        });
        tick();

        expect(res.message).toBe('reset succeed');
      })));
  });


});
