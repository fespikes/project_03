import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { TuiModalRef,  } from 'tdc-ui';
import { TuiMessageService, TUI_MODAL_DATA, TuiModalService } from 'tdc-ui';
import { TecApiService } from '../../shared';
import { NodeService } from '../node.service';
import { EditTagsComponent } from './edit-tags.component';
import { TranslateService } from '../../i18n';

describe('EditTagsComponent', () => {
  let component: EditTagsComponent;
  let fixture: ComponentFixture<EditTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TranslatePipeStub,
        DefaultPipeStub,
        EditTagsComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
        HttpClientModule
      ],
      providers: [
        TuiModalRef,
        TuiMessageService,
        NodeService,
        TecApiService,
        {
          provide: TUI_MODAL_DATA,
          useValue: {},
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
    fixture = TestBed.createComponent(EditTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
