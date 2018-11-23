import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { TuiModule, TuiModalService, TuiModalRef, TUI_MODAL_DATA, TuiMessageService } from 'tdc-ui';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import {
  SystemService,
  SystemModalService,
  TecApiService
} from 'app/shared';
import { NetworkService } from '../network.service';
import { AddComponent } from './add.component';
import { TranslateService } from 'app/i18n';
import { TranslateServiceMock } from 'app/mock';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
        TuiModule,
      ],
      declarations: [
        TranslatePipeStub,
        DefaultPipeStub,
        AddComponent
      ],
      providers: [
        NetworkService,
        SystemService,
        SystemModalService,
        TecApiService,
        TuiModalRef,
        TuiMessageService,
        {
          provide: TUI_MODAL_DATA,
          useValue: {},
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
