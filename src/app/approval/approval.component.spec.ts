import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import {
  TabPaneDirective,
  TableModule,
  IconModule,
  BtnModule,
} from 'tdc-ui';
import { I18nModule } from '../i18n';
import { SharedModule } from '../shared';
import { TranslateService } from '../i18n';
import { Observable } from 'rxjs/Observable';

import { ApprovalRoutingModule } from './approval-routing.module';
import { PendingComponent } from './pending/pending.component';
import { FlowComponent } from './flow/flow.component';
import { ApprovalService } from './approval.service';
import { TaskComponent } from './task/task.component';
import { EditComponent } from './edit/edit.component';

import { ApprovalComponent } from './approval.component';

describe('ApprovalComponent', () => {
  let component: ApprovalComponent;
  let fixture: ComponentFixture<ApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        ApprovalComponent,
        PendingComponent,
        FlowComponent,
        TranslatePipeStub,
        DefaultPipeStub,
        TabPaneDirective
      ],
      providers: [
        {
          provide: TranslateService,
          useValue: {
            get() {
              return Observable.of();
            },
            translateKey() {},
          },
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
