import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { TuiModule, TuiModalService } from 'tdc-ui';

import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '../i18n';

import { SharedModule, TecApiService } from '../shared';

import { I18nModule } from '../i18n';
import { TasksComponent } from './tasks.component';
import { TasksService } from './tasks.service';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TasksComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],
      imports: [
        FormsModule,
        I18nModule,
        TuiModule,
        SharedModule,
      ],
      providers: [
        TasksService,
        TecApiService,
        MockBackend,
        BaseRequestOptions,
        TuiModalService,
        { provide: Http,
          useFactory: (backend: ConnectionBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        {
          provide: TranslateService,
          useValue: {
            get() {
              return Observable.of();
            },
            translateKey() {},
          },
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
