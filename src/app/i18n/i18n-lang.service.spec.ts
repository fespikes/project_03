import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { I18nLangService, LANG_KEY, Language } from './i18n-lang.service';
import { TecApiService } from '../shared';

class TecApiServiceStub {
  post() {
    return Observable.of({});
  }
}

describe('I18nLangService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        I18nLangService,
        {
          provide: TecApiService,
          useClass: TecApiServiceStub,
        },
      ],
    });
  });

  afterEach(() => {
    window.localStorage.removeItem(LANG_KEY);
  });

  it('should return lang according to navigator and localstorage', inject([I18nLangService], (service: I18nLangService) => {
    localStorage.setItem(LANG_KEY, 'en_US');
    service.initLangId();
    expect(service.lang).toBe('en_US');
  }));

  it('should set localstorage when setting lang', inject([I18nLangService], (service: I18nLangService) => {
    service.lang = 'en_US';
    expect(localStorage.getItem(LANG_KEY)).toBe('en_US');
  }));

  it('should emit event when setting lang', fakeAsync(inject([I18nLangService], (service: I18nLangService) => {
    service.lang = 'en_US';
    const sub = service.current.subscribe((lang) => {
      expect(lang).toBe('en_US');
    });
    sub.unsubscribe();
    service.lang = 'zh_CN';
    service.current.subscribe((lang) => {
      expect(lang).toBe('zh_CN');
    });
  })));

  it('should loop Language enum when switching language', inject([I18nLangService], (service: I18nLangService) => {
    expect(Language[1]).toBe('zh_CN');
    expect(Language[2]).toBe('en_US');

    service.lang = Language[1];
    service.switch('zh_CN').subscribe();
    expect(service.lang).toBe(Language[1]);

    service.switch('en_US').subscribe();
    expect(service.lang).toBe(Language[2]);
  }));
});
