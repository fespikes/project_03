import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipeStub, DefaultPipeStub, TranslateServiceMock } from 'app/mock';

import { SharedModule, TecApiService } from '../../shared';
import { TranslateService } from '../../i18n';
import { ApprovalService } from '../approval.service';

import { PendingComponent } from './pending.component';

describe('PendingComponent', () => {
  let component: PendingComponent;
  let fixture: ComponentFixture<PendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterTestingModule
      ],
      declarations: [
        PendingComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],
      providers: [
        ApprovalService,
        TecApiService,
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
