
import {map,  distinctUntilChanged } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { TecApiService } from '../shared/services/api.service';

export const LANG_KEY = 'tec_language';

export enum Language {
  zh_CN = 1,
  en_US,
}

const BCP47Mapping = {
  en_US: 'en-US',
  zh_CN: 'zh-CN',
};

@Injectable()
export class I18nLangService {
  private langId: Language;
  private currentLangSubject = new BehaviorSubject<string>(this.lang);
  current = this.currentLangSubject.asObservable().pipe(distinctUntilChanged());
  currentBCP47 = this.current.pipe(map((lang) => {
    return BCP47Mapping[lang];
  }));

  constructor(
    private api: TecApiService,
  ) {}

  set lang(lang: string) {
    this.langId = Language[lang];
    window.localStorage.setItem(LANG_KEY, lang);
    this.currentLangSubject.next(lang);
  }

  get lang() {
    if (!this.langId) {
      this.initLangId();
    }
    return Language[this.langId];
  }

  initLangId() {
    const lang = window.localStorage.getItem(LANG_KEY) || navigator.language;
    this.langId = Language[lang] || 1;
  }

  switch(lang: string) {
    if (!Language[lang]) {
      return;
    }
    return this.api.post('locale', { code: lang }).pipe(
    map(() => {
      this.lang = lang;
    }));
  }
}
