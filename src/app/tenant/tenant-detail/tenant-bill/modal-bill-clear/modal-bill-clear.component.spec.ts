import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { TuiModalService, TUI_MODAL_DATA, TuiModalRef } from 'tdc-ui';

import { TenantService } from 'app/tenant/tenant.service';
import { TranslatePipeStub } from 'app/mock';
import { ModalBillClearComponent } from './modal-bill-clear.component';

class TuiModalServiceStub {
  apiError() { }
}

class TenantServiceStub {
  clearBill() {
    return Observable.of({
      data: {},
    });
  }
}

describe('ModalBillClearComponent', () => {
  let component: ModalBillClearComponent;
  let fixture: ComponentFixture<ModalBillClearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        ModalBillClearComponent,
        TranslatePipeStub,
      ],
      providers: [
        {
          provide: TuiModalRef,
          useValue: {},
        },
        {
          provide: TUI_MODAL_DATA,
          useValue: {},
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
    fixture = TestBed.createComponent(ModalBillClearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
