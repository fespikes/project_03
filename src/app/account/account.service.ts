import { Injectable } from '@angular/core';

import {
  TecApiService,
} from '../shared';

@Injectable()
export class AccountService {

  constructor(
    private api: TecApiService,
  ) { }

  changePWD(params) {
    this.api.post(`admins/resetPassword`, {...params});
  }

}
