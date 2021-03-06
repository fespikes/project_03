import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { TuiModule, TuiMessageService } from 'tdc-ui';

import {
  I18nModule,
  TranslateService,
  TranslateResolver,
  TranslateToken,
  I18nLangService,
} from './i18n';

import { TecApiService, TecUtilService } from './shared';

import { NotFoundModule } from './not-found';
import { LayoutModule } from './layout';
import { SharedModule } from './shared';
import { IconModule } from '../assets/icons/icon.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    TuiModule,
    I18nModule,
    IconModule,
    SharedModule,
    LayoutModule,
    NotFoundModule,
    AppRoutingModule,
  ],
  providers: [
    TecApiService,
    TecUtilService,
    I18nLangService,
    TuiMessageService,
    TranslateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
