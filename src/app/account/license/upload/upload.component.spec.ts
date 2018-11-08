import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterTestingModule } from '@angular/router/testing';
import { TuiModalRef, TUI_MODAL_DATA, TuiModalService } from 'tdc-ui';
import { UploadComponent } from './upload.component';
import { TranslateService } from '../../../i18n/translate.service';
import { TuiMessageService } from 'tdc-ui';
import { AccountService } from '../../account.service';

import { TecApiService } from '../../../shared';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpClientModule,
        OverlayModule,
        RouterTestingModule
      ],
      declarations: [ UploadComponent ],
      providers: [
        AccountService,
        TuiModalRef,
        {
          provide: TUI_MODAL_DATA,
          useValue: {},
        },
        TuiModalService,
        TecApiService,
        TuiMessageService,
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
