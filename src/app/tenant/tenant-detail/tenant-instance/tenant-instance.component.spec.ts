import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TuiModalService } from 'tdc-ui';

import { TranslateService } from 'app/i18n';
import { TenantService } from 'app/tenant/tenant.service';
import { TenantInstanceComponent } from './tenant-instance.component';
import { MockModule } from 'app/mock';

class TenantServiceStub {
  fetchInstanceInfos() {
    return Observable.of({
      data: [],
      pagination: {},
    });
  }
}

class TuiModalServiceStub {
  apiError() { }
}

describe('TenantInstanceComponent', () => {
  let component: TenantInstanceComponent;
  let fixture: ComponentFixture<TenantInstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MockModule],
      declarations: [
        TenantInstanceComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({ uid: 123 }),
          },
        },
        {
          provide: TuiModalService,
          useClass: TuiModalServiceStub,
        },
        {
          provide: TenantService,
          useClass: TenantServiceStub,
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
