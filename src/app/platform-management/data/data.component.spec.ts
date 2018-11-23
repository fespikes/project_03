import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpModule } from '@angular/http';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayModule } from '@angular/cdk/overlay';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from 'app/i18n/';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { TuiModalService, TuiMessageService } from 'tdc-ui';
import { TecApiService } from 'app/shared';

import {
  SystemService,
  SystemModalService,
  SharedModule
} from 'app/shared';
import { DataService } from './data.service';
import { ShareComponent } from './share/share.component';
import { EditComponent } from '../edit/edit.component';
import { of } from 'rxjs';
import { DataComponent } from './data.component';

describe('DataComponent', () => {
  let component: DataComponent;
  let fixture: ComponentFixture<DataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        OverlayModule,
        RouterTestingModule
      ],
      declarations: [
        TranslatePipeStub,
        DefaultPipeStub,
        DataComponent,
        ShareComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        },
        DataService,
        SystemService,
        SystemModalService,
        TuiModalService,
        TuiMessageService,
        TecApiService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
