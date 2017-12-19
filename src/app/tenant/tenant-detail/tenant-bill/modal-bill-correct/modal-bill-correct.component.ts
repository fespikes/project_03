import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TuiModalRef, TuiModalService, TUI_MODAL_DATA } from 'tdc-ui';

import { Bill } from 'app/tenant/tenant-model';
import { TenantService } from 'app/tenant/tenant.service';

@Component({
  selector: 'tec-modal-bill-correct',
  templateUrl: './modal-bill-correct.component.html',
  styleUrls: ['./modal-bill-correct.component.sass'],
})
export class ModalBillCorrectComponent {
  correctionForm: FormGroup;
  bill = new Bill();

  correctionTypes = [
    'DEDUCT',
    'ADD',
  ];

  constructor(
    private modal: TuiModalRef,
    private modalService: TuiModalService,
    private tenantService: TenantService,
    private fb: FormBuilder,
    @Inject(TUI_MODAL_DATA) data,
  ) {
    this.bill = data;
    this.correctionForm = this.fb.group({
      amount: [],
      reason: [],
      type: [],
    });
  }

  confirm() {
    const correction = this.correctionForm.value;
    this.tenantService.correctBill(this.bill.id, correction)
      .subscribe(() => {
        this.modal.close(true);
      }, this.modalService.apiError);
  }

  close() {
    this.modal.close();
  }

}
