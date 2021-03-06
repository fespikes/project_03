import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18nModule } from '../i18n';
import { SharedModule, MetaDateService } from '../shared';

import { LayoutComponent } from './layout.component';
import { LayoutHeadComponent } from './layout-head/layout-head.component';
import { LayoutHeadNavComponent } from './layout-head/layout-head-nav/layout-head-nav.component';
import { LayoutHeadRightComponent } from './layout-head/layout-head-right/layout-head-right.component';

import { LayoutService } from './layout.service';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    I18nModule,
    SharedModule,
  ],
  declarations: [
    LayoutComponent,
    LayoutHeadComponent,
    LayoutHeadNavComponent,
    LayoutHeadRightComponent,
  ],
  providers: [
    LayoutService,
    MetaDateService
  ],
})
export class LayoutModule { }
