import {
  Component,
  OnInit,
  HostBinding,
  OnChanges,
  SimpleChange,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TuiModalService } from 'tdc-ui';

import { TenantInfo } from '../tenant-model';
import { TenantService } from '../tenant.service';

@Component({
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.sass'],
})
export class TenantDetailComponent implements OnInit, OnChanges {
  @HostBinding('class.tui-layout-body') hostClass = true;
  submenuItems = [];
  tenant = new TenantInfo();

  tenantsCount = 0;
  selectedTabIndex = 0;
  loading;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: TuiModalService,
    private tenantService: TenantService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const idx = +params['idx'];

      if (this.selectedTabIndex === idx || !params['idx']) {
        return;
      } else {
        this.selectedTabIndex = idx || 0;
        const tabs: Array<any> = document.body.querySelectorAll('.tui-tab-item');
        const evt = document.createEvent('MouseEvents');
        evt.initEvent('click', false, false);
        tabs[idx].dispatchEvent(evt);
      }
    });

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
          name: tenant.name + ' (' + tenant.uid + ')' ,
          url: `/tenant/detail/${tenant.uid}`,
          icon: '',
        }));
      });
  }

  navigateBack() {
    this.router.navigateByUrl('/tenant/overview');
  }

  selectedIndexChange($event) {
    const idx = +$event;
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    this.router.navigate([`/tenant/detail/${uid}`], { queryParams: { idx: idx } })
      .then(_ => _ );
  }

}
