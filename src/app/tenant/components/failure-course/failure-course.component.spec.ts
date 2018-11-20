import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';

import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { TranslateService } from '../../../i18n';
import { TuiModalRef, TUI_MODAL_DATA, TuiModalService } from 'tdc-ui';

import { FailureCourseComponent } from './failure-course.component';

describe('FailureCourseComponent', () => {
  let component: FailureCourseComponent;
  let fixture: ComponentFixture<FailureCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],

      declarations: [
        TranslatePipeStub,
        DefaultPipeStub,
        FailureCourseComponent,
      ],
      providers: [
        TuiModalRef,
        {
          provide: TUI_MODAL_DATA,
          useValue: {},
        },
        {
          provide: TranslateService,
          useValue: {
            get() {
              return of();
            },
            translateKey() { },
          },
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
