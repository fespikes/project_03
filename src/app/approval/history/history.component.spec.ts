import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '../../i18n';
import { SharedModule, TecApiService } from '../../shared';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';

import { ApprovalService } from '../approval.service';
import { HistoryComponent } from './history.component';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule
      ],
      declarations: [
        HistoryComponent,
        DefaultPipeStub,
        TranslatePipeStub
      ],
      providers: [
        ApprovalService,
        TecApiService,
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
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
