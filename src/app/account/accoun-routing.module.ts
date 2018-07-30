import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';
import { AccountComponent } from './account.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';

export const accountRoutes: Routes = [{
  path: '',
  component: AccountComponent,
  resolve: [TranslateResolver],
  canDeactivate: [TranslateDeactivator],
  children: [{
    path: '',
    children: [
      { path: 'change-pwd', component: ChangePwdComponent },
      // { path: '', redirectTo: '/account/login', pathMatch: 'full' },
    ],
  }],
}];

@NgModule({
  imports: [
    RouterModule.forChild(accountRoutes),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    TranslateResolver,
    TranslateDeactivator,
    {
      provide: TranslateToken,
      useValue: 'account',
    },
  ],
})
export class AccounRoutingModule { }
