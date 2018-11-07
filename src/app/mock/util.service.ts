import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TecUtilServiceMock {

  checkSucceed(res) {
    return false;
  }

  checkIsAdmin() {
    return false;
  }
}
