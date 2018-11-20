import { EventEmitter } from '@angular/core';

export class TranslateServiceMock {
  onLangChange = new EventEmitter();
  use() {}
  translateKey() {}
}
