import { Component, Inject } from '@angular/core';

import { TuiModalRef, TuiModalService, TUI_MODAL_DATA } from 'tdc-ui';

import { Bill } from 'app/tenant/tenant-model';
import { TenantService } from 'app/tenant/tenant.service';

@Component({
  selector: 'tec-modal-bill-clear',
  templateUrl: './modal-bill-clear.component.html',
  styleUrls: ['./modal-bill-clear.component.sass'],
})
export class ModalBillClearComponent {
  bill = new Bill();

  constructor(
    private modal: TuiModalRef,
    private modalService: TuiModalService,
    private tenantService: TenantService,
    @Inject(TUI_MODAL_DATA) data,
  ) {
    this.bill = data;
  }

  confirm() {
    this.tenantService.clearBill(this.bill.id)
      .subscribe(() => {
        this.modal.close(true);
      });
  }

  close() {
    this.modal.close();
  }

}
