import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TuiModalService, TUI_MODAL_DATA, TuiModalRef, SelectOptionComponent } from 'tdc-ui';

import { TenantService } from 'app/tenant/tenant.service';
import { TranslatePipeStub } from 'app/mock';
import { MockModule } from 'tdc-ui/mock';

import { ModalBillCorrectComponent } from './modal-bill-correct.component';

class TuiModalServiceStub {
  apiError() { }
}

class TenantServiceStub {
  correctBill() {
    return Observable.of({
      data: {},
    });
  }
}

class TccModalRefStub {
  close() { }
}

describe('ModalBillCorrectComponent', () => {
  let component: ModalBillCorrectComponent;
  let fixture: ComponentFixture<ModalBillCorrectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MockModule,
      ],
      declarations: [
        ModalBillCorrectComponent,
      ],
      providers: [
        {
          provide: TuiModalRef,
          useClass: TccModalRefStub,
        },
        {
          provide: TUI_MODAL_DATA,
          useValue: {
            id: 1,
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
    fixture = TestBed.createComponent(ModalBillCorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
