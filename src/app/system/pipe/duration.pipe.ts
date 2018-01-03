import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from 'app/i18n';

@Pipe({
  name: 'serviceDuration',
})
export class ServiceDurationPipe implements PipeTransform {
    SECOND = 1000;
    MINUTE = 60 * this.SECOND;
    HOUR = 60 * this.MINUTE;
    DAY = 24 * this.HOUR;
    MONTH = 30 * this.DAY;
    YEAR = 12 * this.MONTH;

    constructor(
      private translate: TranslateService,
    ) {}

    transform(value: number, args?: any): any {

      let unit = this.translate.translateKey('SYSTEM.OVERVIEW.MILLISECOND');

      if (value / this.YEAR >= 1) {
        value = Math.round(value / this.YEAR);
        unit = this.translate.translateKey('SYSTEM.OVERVIEW.YEAR');
      }else if (value / this.MONTH >= 1) {
        value = Math.round(value / this.MONTH);
        unit = this.translate.translateKey('SYSTEM.OVERVIEW.MONTH');
      }else if (value / this.DAY >= 1) {
        value = Math.round(value / this.DAY);
        unit = this.translate.translateKey('SYSTEM.OVERVIEW.DAY');
      }else if (value / this.HOUR >= 1) {
        value = Math.round(value / this.HOUR);
        unit = this.translate.translateKey('SYSTEM.OVERVIEW.HOUR');
      }else if (value / this.MINUTE >= 1) {
        value = Math.round(value / this.MINUTE);
        unit = this.translate.translateKey('SYSTEM.OVERVIEW.MINUTE');
      }else if (value / this.SECOND >= 1) {
        value = Math.round(value / this.SECOND);
        unit = this.translate.translateKey('SYSTEM.OVERVIEW.SECOND');
      }
      return `${value}${unit}`;
    }
}
