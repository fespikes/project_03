import { Inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TranslateService } from './translate.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { TranslateToken } from '../i18n/translate-token';

@Injectable()
export class TranslateResolver implements Resolve<Observable<Object>> {
  constructor(
    private translate: TranslateService,
    @Inject(TranslateToken) private translateToken: string,
  ) {
  }

  resolve() {
    // return Observable.of('');
    return this.translate.load(this.translateToken)
    .map(() => null);
  }
}
