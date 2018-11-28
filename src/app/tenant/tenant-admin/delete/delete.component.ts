import { Component, OnInit, HostBinding, Inject } from '@angular/core';

import { TuiModalRef, TUI_MODAL_DATA, TuiModalService } from 'tdc-ui';
import { TenantService } from '../../tenant.service';

@Component({
  selector: 'tec-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteComponent implements OnInit {
  tenant: any;
  canDelete = false;
  disabled: boolean;

  constructor(
    private modalRef: TuiModalRef,
    private tenantService: TenantService,
    @Inject(TUI_MODAL_DATA) private data: any,
  ) {
    this.tenant = data;
    this.canDelete = data.usedTenantQuantity > 0 ? false : true;
  }

  ngOnInit() {}

  confirm() {
    this.disabled = true;
    this.tenantService.deleteTenantAdmin(this.tenant.username)
    .subscribe((result) => {
      this.disabled = false;
      this.modalRef.close(true);
    }, (error) => {
      this.disabled = false;
    });
  }

  cancel() {
    this.modalRef.close(false);
  }
}
