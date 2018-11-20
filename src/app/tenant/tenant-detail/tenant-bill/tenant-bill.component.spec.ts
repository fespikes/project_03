import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TuiModalService } from 'tdc-ui';

import { TranslateService } from 'app/i18n';
import { TenantService } from 'app/tenant/tenant.service';
import { TenantBillComponent } from './tenant-bill.component';
import { TranslatePipeStub, TranslateServiceMock } from 'app/mock';

class TenantServiceStub {
  fetchBills() {
    return of({
      data: [],
      pagination: {},
    });
  }
}

class TuiModalServiceStub {
  apiError() { }
  open() {}
}

describe('TenantBillComponent', () => {
  let component: TenantBillComponent;
  let fixture: ComponentFixture<TenantBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        TenantBillComponent,
        TranslatePipeStub,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ uid: 123 }),
          },
        },
        {
          provide: TuiModalService,
          useClass: TuiModalServiceStub,
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
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
    fixture = TestBed.createComponent(TenantBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
