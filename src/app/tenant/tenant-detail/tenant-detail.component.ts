import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TuiModalService } from 'tdc-ui';

import { TenantInfo } from '../tenant-model';
import { TenantService } from '../tenant.service';

@Component({
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.sass'],
})
export class TenantDetailComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;
  submenuItems = [];
  tenant = new TenantInfo();

  tenantsCount = 0;
  loading;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: TuiModalService,
    private tenantService: TenantService,
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params) => {
        this.loading = true;
        this.tenantService.fetchInfo(params['uid'])
          .subscribe((result) => {
            this.tenant = result;
            this.loading = false;
          });
      }, this.modal.apiError);

    this.tenantService.fetchTenantsCount()
      .subscribe((result) => {
        this.tenantsCount = result.count;
      });

    this.tenantService.fetchAllTenants()
      .subscribe((result) => {
        this.submenuItems = result.map((tenant) => ({
          name: tenant.name,
          url: `/tenant/detail/${tenant.uid}`,
          icon: '',
        }));
      });
  }

  navigateBack() {
    this.router.navigateByUrl('/tenant/overview');
  }



}
