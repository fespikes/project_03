import { Inject, Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { TranslateService } from './translate.service';
import { TranslateToken } from './translate-token';

@Injectable()
export class TranslateDeactivator implements CanDeactivate<boolean> {
  constructor(
    private translate: TranslateService,
    @Inject(TranslateToken) private translateToken: string,
  ) {}

  canDeactivate(): boolean {
    this.translate.activeI18n.remove(this.translateToken);
    return true;
  }
}
