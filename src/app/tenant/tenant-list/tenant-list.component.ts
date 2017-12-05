import { Component, OnInit, HostBinding } from '@angular/core';

import { Pagination } from 'tdc-ui';

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

  tenants: TenantSummary[];

  pagination = new Pagination();

  constructor(
    private tenantService: TenantService,
  ) { }

  ngOnInit() {
    this.tenantService.fetchTenantsCount()
      .subscribe((result) => {
        this.tenantsCount = result.data.count;
      });
    this.getTenants().subscribe();
  }

  search() {
    this.getTenants().subscribe();
  }

  paginationChange() {}

  getTenants() {
    this.loading = true;
    return this.tenantService.fetchSummaries(this.keyword)
      .map((result) => {
        this.tenants = result.data.data;
        this.pagination = result.data.pagination;
        this.loading = false;
      });
  }

}
