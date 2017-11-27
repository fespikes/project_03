import {
  Inject,
  Injectable,
  EventEmitter,
} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import merge from 'lodash/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

import { I18nLangService } from './i18n-lang.service';

export class ActiveI18n {
  store: string[] = [];

  add(token: string) {
    if (this.store.includes(token)) {
      return;
    }
    this.store.push(token);
  }

  remove(token: string) {
    const index = this.store.indexOf(token);
    if (~index) {
      this.store.splice(index, 1);
    }
  }
}

@Injectable()
export class TranslateService {
  /** 在切换语言，并且i18n文件加载完成后，会触发`onLangChange`事件 */
  onLangChange = new EventEmitter();

  /** 国际化文本存储位置 */
  store = {};

  /** 记录对应的i18n文件是否被加载过 */
  loadedI18n = {};

  /** 当前视图中正在生效的i18n文件，记录这个信息的目的是，当切换语言时，加载对应的i18n文件 */
  activeI18n = new ActiveI18n();
  prefix = './assets/i18n/';
  lang: string;

  constructor(
    private http: Http,
    private i18nLang: I18nLangService,
  ) {
    // 因为TranslateService是单例运行，所以不需要对`i18nLang.current`做清理工作
    i18nLang.current.subscribe((lang) => {
      this.use(lang);
    });
  }

  merge(lang: string, json: Object) {
    this.store[lang] = this.store[lang] || {};
    merge(this.store[lang], json);
  }

  /**
   * 载入当前语言的片段i18n文件
   * @param token string 文件标记
   */
  load(token): Observable<Object> {
    // 检查i18n文件是否被加载过
    try {
      const loaded = this.loadedI18n[this.lang][token];
      if (loaded) {
        this.activeI18n.add(token);
        return Observable.of(this.store);
      }
    } catch (e) {
      // noop
    }
    return this.http.get(`${this.prefix}${this.lang}/${token}.json`)
    .map((res: Response) => res.json())
    .map((json) => {
      this.loadedI18n[this.lang] = this.loadedI18n[this.lang] || {};
      this.loadedI18n[this.lang][token] = true;
      this.activeI18n.add(token);
      this.merge(this.lang, json);
      return this.store;
    });
  }

  /**
   * 改变当前语言
   * @param lang
   */
  use(lang) {
    this.lang = lang;
    Observable.forkJoin(this.activeI18n.store.map((token: string) => this.load(token)))
    .subscribe(() => {
      this.onLangChange.emit(this);
    });
  }

  /**
   * 翻译字段
   * @param _key
   */
  translateKey(_key) {
    if (!_key) {
      return '';
    }
    const key = _key.toString();
    if (!this.lang || !this.store[this.lang]) {
      return key;
    }
    const store = this.store[this.lang];
    const keyArr = key.split('.');
    let value = store;
    try {
      keyArr.forEach((k) => {
        value = value[k];
      });
      if (typeof value === 'string') {
        return value;
      } else {
        return key;
      }
    } catch (err) {
      return key;
    }
  }

}
