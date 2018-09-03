import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TuiModalService, TuiMessageService } from 'tdc-ui';
import { MockModule } from '../../../mock';
import { I18nLangService, TranslateService } from '../../../i18n';
import { LayoutHeadRightComponent } from './layout-head-right.component';

import { TecApiService } from '../../../shared';
import { LayoutService } from '../../layout.service';

describe('LayoutHeadRightComponent', () => {
  let component: LayoutHeadRightComponent;
  let fixture: ComponentFixture<LayoutHeadRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MockModule, OverlayModule, HttpClientModule],
      declarations: [ LayoutHeadRightComponent ],
      providers: [
        LayoutService,
        TecApiService,
        TuiModalService,
        TuiMessageService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        },
        HttpClient,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutHeadRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
