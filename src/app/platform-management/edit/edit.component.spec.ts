import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';

import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { TecApiService } from 'app/shared';
import { EditService } from './edit.service';
import { TranslateService } from 'app/i18n';
import { SystemModuleService } from '../system/system.service';
import { EditComponent } from './edit.component';
import { TuiModule, TuiModalService, TuiModalRef, TUI_MODAL_DATA, TuiMessageService } from 'tdc-ui';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
        TuiModule
      ],
      declarations: [
        TranslatePipeStub,
        DefaultPipeStub,
        EditComponent
      ],
      providers: [
        {
          provide: TUI_MODAL_DATA,
          useValue: {},
        },
        {
          provide: TranslateService,
          useValue: {
            use() {},
          }
        },
        EditService,
        TuiModalRef,
        TuiMessageService,
        TecApiService,
        SystemModuleService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
