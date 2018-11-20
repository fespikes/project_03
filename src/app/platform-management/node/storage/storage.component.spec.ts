import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, OnInit, HostBinding, OnDestroy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

import { TranslatePipeStub, TranslateServiceMock } from 'app/mock';
import { TuiModalService , TabPaneDirective, TuiMessageService } from 'tdc-ui';

import { NodeService } from '../node.service';
import { TranslateService } from '../../i18n';
import { TecApiService } from '../../shared';
import { StorageComponent } from './storage.component';
class RouterStub {
  events = new Subject();
}
describe('StorageComponent', () => {
  let component: StorageComponent;
  let fixture: ComponentFixture<StorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        OverlayModule
      ],
      declarations: [
        TabPaneDirective,
        StorageComponent,
        TranslatePipeStub
      ],
      providers: [
        NodeService,
        TecApiService,
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
          },
        },
        {
          provide: Router,
          useClass: RouterStub,
        },
        TuiModalService,
        TuiMessageService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
