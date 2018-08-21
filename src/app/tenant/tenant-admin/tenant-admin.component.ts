import { Component, OnInit, HostBinding } from '@angular/core';

import { Pagination, TuiModalService, TuiMessageService } from 'tdc-ui';

import { TenantService } from '../tenant.service';
import { TranslateService } from 'app/i18n';
import { TenantAdminFilter, TenantAdmin } from '../tenant-model';

import { AddComponent } from './add/add.component';
import { SendRegisterLinkComponent } from './send-register-link/send-register-link.component';


@Component({
  selector: 'tec-tenant-admin',
  templateUrl: './tenant-admin.component.html',
  styleUrls: ['./tenant-admin.component.sass'],
})
export class TenantAdminComponent implements OnInit {

  loading = false;
  pagination = new Pagination();
  filter = new TenantAdminFilter;
  TenantAdmins: TenantAdmin[];
  quantityEditing = false;
  editingIndex: number;

  constructor(
    private tenantService: TenantService,
    private modalService: TuiModalService,
    private translateService: TranslateService,
    private message: TuiMessageService,
  ) { }

  ngOnInit() {
    this.getTenantAdmins();
  }

  getTenantAdmins() {
    this.loading = true;
    this.filter.page = this.pagination.page;
    this.filter.size = this.pagination.size;
    this.tenantService.getTenantAdmins(this.filter)
      .subscribe((result) => {
        this.TenantAdmins = result.data;
        this.pagination = result.pagination;
        this.loading = false;
      });
  }

  filterChange() {
    this.pagination.page = 1;
    this.getTenantAdmins();
  }

  openAddModel(size = 'lg') {
    return this.modalService.open(AddComponent, {
      title: this.translateService.translateKey('TENANT.TENANT_ADMIN.ADD'),
      size,
    })
    .subscribe((word: string) => {
      this.getTenantAdmins();
    });
  }

  openSendModel(size = 'lg') {
    return this.modalService.open(SendRegisterLinkComponent, {
      title: this.translateService.translateKey('TENANT.TENANT_ADMIN.SEND'),
      size,
    })
    .subscribe((word: string) => {});
  }

  edit(param: boolean, i) {
    this.quantityEditing = param;
    this.editingIndex = i;
  }

  put(item, max: HTMLInputElement) {
    const val = max.value;
    if (val === item.maxTenantQuantity) {
      return ;
    }

    this.loading = true;
    if (val >= item.usedTenantQuantity || val === '') {
      this.tenantService.putQuantity(item.username, max.value)
        .subscribe(res => {
          setTimeout( _ => {
            this.getTenantAdmins();
            this.quantityEditing = false;
            this.loading = false;
          }, 300);
        });
      } else {
        this.loading = false;
        this.message.error(
          this.translateService.translateKey('TENANT.ERROR.MUST_BIGGER') +
          item.usedTenantQuantity + ', ' +
          this.translateService.translateKey('TENANT.ERROR.BLANK_MEANS'));
    }
  }

}
