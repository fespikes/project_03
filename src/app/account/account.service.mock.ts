import { Injectable } from '@angular/core';

import { TecApiService } from '../shared';
import { SpyObject } from '../shared/test';

import { AccountService } from './account.service';

@Injectable()
export class AccountServiceMock extends SpyObject {

  changePWDSpy;
  fakeResponse;

  constructor() {

    super(AccountService);
    this.fakeResponse = null;

    this.changePWDSpy = this.spy('changePWD').andReturn(this);
  }

  subscribe(callback) {
    callback(this.fakeResponse);
  }

  setResponse(json: any): void {
    this.fakeResponse = json;
  }

  getProviders(): Array<any> {
    return [{ provide: AccountService, useValue: this }];
  }

}
