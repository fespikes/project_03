import { Component, OnInit, HostBinding } from '@angular/core';

import { Pagination } from 'tdc-ui';

import { TenantFilter } from '../tenant-model';
import { TenantService } from '../tenant.service';
import { TenantSummary } from '../tenant-model';

@Component({
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.sass'],
})
export class TenantListComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  loading;
  keyword = '';
  tenantsCount = 0;
  filter = new TenantFilter();

  tenants: TenantSummary[];

  pagination = new Pagination();

  constructor(
    private tenantService: TenantService,
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

}
