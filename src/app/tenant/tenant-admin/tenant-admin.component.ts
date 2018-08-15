import { Component, OnInit, HostBinding } from '@angular/core';

import { Pagination, TuiModalService } from 'tdc-ui';

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

  constructor(
    private tenantService: TenantService,
    private modalService: TuiModalService,
    private translateService: TranslateService,

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

}
