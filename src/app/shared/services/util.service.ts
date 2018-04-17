import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TimeOption } from '../';

import { TecApiService } from './';
import { TranslateService } from '../../i18n';

@Injectable()
export class TecUtilService {

  constructor(private translateService: TranslateService) { }

  getSelectOptions(type?: string) {
    let result: TimeOption[] = [];
    const len: number = (type === 'hour' ? 24 : 12);  // 12 months
    const translate = this.translateService.translateKey;

    for (let i = len; i > 0; i--) {
      const str: string = i === 1 ?
        ( i + ' ' + (type === 'hour' ? this.translateService.translateKey('TUI.SELECT.HOUR')
                      : this.translateService.translateKey('TUI.SELECT.MONTH')))
        : (i + ' ' + (type === 'hour' ? this.translateService.translateKey('TUI.SELECT.HOURS')
                    : this.translateService.translateKey('TUI.SELECT.MONTHS')));
      result = [{
        label: this.translateService.translateKey('TUI.SELECT.LAST') + ' ' + str,
        value: i,
      }].concat(result);
    }

    return result;
  }

  trigger = (dt: number, option, wrapper, options?) => {
    options = options || this.getSelectOptions(); // month
    if (option.value === dt) {
      return ;
    } else {
      option = options[dt - 1];
      wrapper.getChartData(dt);
    }
  }

  /**
  * if no config in params, this function only add namespace
  */
  addToNameSpace(tgt, names, config?): void {
    const result = tgt;
    const arr = names.split('.');
    let temp = tgt;
    for (let i = 0; i < arr.length; i++ ) {
      if ((i === arr.length - 1) && config ) {
        temp[arr[i]] = config;
      } else {
        temp[arr[i]] = temp[arr[i]] || {};
        temp = temp[arr[i]];
      }
    }
    return tgt;
  }
}
