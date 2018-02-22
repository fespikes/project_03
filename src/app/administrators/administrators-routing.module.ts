import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { I18nModule, TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';

import { AdministratorsComponent } from './administrators.component';
import { AddComponent } from './add/add.component';

const administratorsRoutes: Routes = [{
  path: '',
  component: AdministratorsComponent,
  resolve: [TranslateResolver],
  canDeactivate: [TranslateDeactivator],
}];

@NgModule({
  imports: [
    RouterModule.forChild(administratorsRoutes),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    TranslateResolver,
    TranslateDeactivator,
    {
      provide: TranslateToken,
      useValue: 'administrators',
    },
  ],
})
export class AdministratorsRoutingModule { }
