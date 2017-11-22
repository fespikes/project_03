import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { MessageComponent } from './message.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MessageComponent,
        resolve: [TranslateResolver],
        canDeactivate: [TranslateDeactivator],
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    TranslateResolver,
    TranslateDeactivator,
    {
      provide: TranslateToken,
      useValue: 'message',
    },
  ],
})
export class MessageRoutingModule { }
