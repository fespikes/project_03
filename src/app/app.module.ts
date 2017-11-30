import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { TuiModule, TuiMessageService } from 'tdc-ui';

import {
  I18nModule,
  TranslateService,
  TranslateResolver,
  TranslateToken,
  I18nLangService,
} from './i18n';

import { TecApiService } from './shared';

import { NotFoundModule } from './not-found';
import { LayoutModule } from './layout';
import { SharedModule } from './shared';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    TuiModule,
    I18nModule,
    SharedModule,
    LayoutModule,
    NotFoundModule,
    AppRoutingModule,
  ],
  providers: [
    TecApiService,
    I18nLangService,
    TuiMessageService,
    TranslateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
