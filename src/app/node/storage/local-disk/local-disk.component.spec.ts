import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';

import { TuiMessageService } from 'tdc-ui';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { DonutChart, DonutChartConfig } from '../../../chart/lib';
import { NodeService } from '../../node.service';
import { TecApiService } from '../../../shared';
import { TranslateService } from '../../../i18n';
import { LocalDiskComponent } from './local-disk.component';

describe('LocalDiskComponent', () => {
  let component: LocalDiskComponent;
  let fixture: ComponentFixture<LocalDiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        OverlayModule
      ],
      declarations: [ LocalDiskComponent ],
      providers: [
        NodeService,
        TecApiService,
        TuiMessageService,
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({}),
            queryParams: Observable.of({}),
          },
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalDiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
