import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientModule } from '@angular/common/http';
import { TuiModalRef, TUI_MODAL_DATA, TuiModalService, TuiMessageService } from 'tdc-ui';
import { OverlayModule } from '@angular/cdk/overlay';
import { LicenseComponent } from './license.component';
import { TranslateService } from '../../i18n';
import { AccountService } from '../account.service';
import { TecApiService } from '../../shared';

describe('LicenseComponent', () => {
  let component: LicenseComponent;
  let fixture: ComponentFixture<LicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        OverlayModule,
        RouterTestingModule
      ],
      declarations: [ LicenseComponent ],
      providers: [
        TuiModalRef,
        {
          provide: TUI_MODAL_DATA,
          useValue: {},
        },
        TuiModalService,
        TecApiService,
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        },
        AccountService,
        TuiMessageService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
