import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export class TranslateServiceMock {
  onLangChange = new EventEmitter();
  use() {}
  translateKey() {}
}
