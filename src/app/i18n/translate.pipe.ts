import {
  Pipe,
  PipeTransform,
  OnDestroy,
  OnInit,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';

import { TranslateService } from './translate.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  onLangChange: EventEmitter<TranslateService>;
  lastKey: string;
  value: string;

  constructor(
    private translate: TranslateService,
    private ref: ChangeDetectorRef,
  ) {}

  transform(key: string): any {
    if (key === this.lastKey) {
      return this.value;
    }
    if (!this.onLangChange) {
      this.onLangChange = this.translate.onLangChange.subscribe((translate: TranslateService) => {
        this.value = this.translate.translateKey(key);
        this.ref.markForCheck();
      });
    }
    this.value = this.translate.translateKey(key);
    return this.value;
  }

  ngOnDestroy() {
    if (this.onLangChange) {
      this.onLangChange.unsubscribe();
      this.onLangChange = undefined;
    }
  }

}
