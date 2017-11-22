import { NgModule } from '@angular/core';

import { TranslateService } from './translate.service';
import { TranslateToken } from './translate-token';
import { TranslatePipe } from './translate.pipe';

@NgModule({
  declarations: [
    TranslatePipe,
  ],
  exports: [
    TranslatePipe,
  ],
})
export class I18nModule {}
