import { Component, OnInit, HostBinding, Inject } from '@angular/core';

import { TuiModalRef, TUI_MODAL_DATA, TuiModalService } from 'tdc-ui';
import { TenantService } from '../../tenant.service';

@Component({
  templateUrl: './delete-tenant.component.html',
  styleUrls: ['./delete-tenant.component.sass'],
})
export class ModalDeleteTenantComponent implements OnInit {

  tenant = {
    name: '',
    uid: '',
    password: '',
  };
  disabled = false;

  constructor(
    private modalRef: TuiModalRef,
    private modalService: TuiModalService,
    private tenantService: TenantService,
    @Inject(TUI_MODAL_DATA) private data: any,
  ) {
    this.tenant.name = data.name;
    this.tenant.uid = data.uid;
  }

  ngOnInit() {

  }

  confirm() {
    this.disabled = true;
    this.tenantService.deleteTenant({
      password: this.tenant.password,
      tenantUid: this.tenant.uid,
    })
    .subscribe((result) => {
      this.disabled = false;
      this.modalRef.close(true);
    }, (error) => {
      this.disabled = false;
    });
  }

  cancel() {
    this.modalRef.close();
  }
}
