import { Http } from '@angular/http';
import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { TranslateService, I18nLangService } from '.';
class I18nLangServiceStub {
  current = Observable.of('zh_CN');
}

describe('TranslateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslateService,
        {
          provide: Http,
          useValue: {},
        },
        {
          provide: I18nLangService,
          useClass: I18nLangServiceStub,
        },
      ],
    });
  });

  it('should be created', inject([TranslateService], (service: TranslateService) => {
    expect(service).toBeTruthy();
  }));
});
