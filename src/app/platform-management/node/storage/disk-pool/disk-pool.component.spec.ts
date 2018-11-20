import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { TuiMessageService } from 'tdc-ui';
import { OverlayModule } from '@angular/cdk/overlay';

import { NodeService } from '../../node.service';
import { TecApiService } from '../../../shared';
import { TranslateService } from '../../../i18n';
import { DiskPoolComponent } from './disk-pool.component';

describe('DiskPoolComponent', () => {
  let component: DiskPoolComponent;
  let fixture: ComponentFixture<DiskPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        OverlayModule
      ],
      declarations: [ DiskPoolComponent ],
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
            params: of({}),
            queryParams: of({}),
          },
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiskPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
