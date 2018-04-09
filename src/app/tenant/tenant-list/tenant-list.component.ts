import { Component, OnInit, HostBinding } from '@angular/core';

import { Pagination, TuiModalService } from 'tdc-ui';

import { TenantFilter } from '../tenant-model';
import { TenantService } from '../tenant.service';
import { TranslateService } from 'app/i18n';
import { TenantSummary } from '../tenant-model';
import { ModalDeleteTenantComponent } from '../components/modal/delete-tenant.component';

@Component({
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.sass'],
})
export class TenantListComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  loading;
  tenantsCount = 0;
  filter = new TenantFilter();

  tenants: TenantSummary[];

  pagination = new Pagination();

  constructor(
    private tenantService: TenantService,
    private modalService: TuiModalService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.getTenants();
  }

  getTenants() {
    this.loading = true;
    this.filter.page = this.pagination.page;
    this.filter.size = this.pagination.size;
    this.tenantService.fetchSummaries(this.filter)
      .subscribe((result) => {
        this.tenants = result.data;
        this.pagination = result.pagination;
        this.loading = false;
      });
  }

  filterChange() {
    this.pagination.page = 1;
    this.getTenants();
  }

  deleteTenant(tenant) {
    const config = {
      title: this.translateService.translateKey('TENANT.OVERVIEW.CONFIRM_DELETE'),
      size: 'md',
      data: {
        name: tenant.tenantInfo.name,
        uid: tenant.tenantInfo.uid,
      },
    };
    this.modalService.open(ModalDeleteTenantComponent, config)
    .subscribe(() => {
      this.getTenants();
    });
  }

}
