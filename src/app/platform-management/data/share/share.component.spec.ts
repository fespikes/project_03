import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { DataService } from '../data.service';
import { TecApiService } from 'app/shared';
import { TuiModalRef, TuiMessageService, TUI_MODAL_DATA } from 'tdc-ui';
import { ShareComponent } from './share.component';
import { TranslateService } from 'app/i18n/';

describe('ShareComponent', () => {
  let component: ShareComponent;
  let fixture: ComponentFixture<ShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
      ],
      declarations: [
        TranslatePipeStub,
        DefaultPipeStub,
        ShareComponent
      ],
      providers: [
        TuiModalRef,
        TuiMessageService,
        TecApiService,
        DataService,
        {
          provide: TUI_MODAL_DATA,
          useValue: {
            service: {
              usingInstances: []
            }
          },
        },
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
