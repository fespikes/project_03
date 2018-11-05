import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '../i18n';
import { TuiModalService } from 'tdc-ui';
import { SharedModule } from '../shared';
import { NodeComponent } from './node.component';
import { NodeService } from './node.service';

import { Observable } from 'rxjs/Observable';
import { TecApiService } from 'app/shared';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { NodeServiceStub } from './node.service.stub';

describe('NodeComponent', () => {
  let nodeComponent: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [
        NodeComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],

      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({}),
          },
        },
        {
          provide: NodeService,
          useFactory: (api: TecApiService) => {
            return new NodeServiceStub(api);
          },
          deps: [TecApiService]
        },
        {
          provide: TecApiService,
          getFile() {
            return Observable.of();
          },
        },
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        },
        TuiModalService
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    nodeComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(nodeComponent).toBeTruthy();
  });

});
