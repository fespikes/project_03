import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

export class TranslateServiceMock {
  onLangChange= new EventEmitter();
  use() {}
  translateKey() {}
}
