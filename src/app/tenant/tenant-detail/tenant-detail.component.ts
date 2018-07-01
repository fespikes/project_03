import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { TuiModalService } from 'tdc-ui';

import { TenantInfo } from '../tenant-model';
import { TenantService } from '../tenant.service';
import { TranslateService } from 'app/i18n';
import { TranslateServiceStub } from 'tdc-ui/mock/mock';

import { ModalDeleteTenantComponent } from '../components/modal/delete-tenant.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Component({
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.sass'],
})
export class TenantDetailComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;
  submenuItems = [];
  tenant = new TenantInfo();

  tenantsCount = 0;
  selectedTabIndex = 0;
  loading;
  uid;

  filter = {
    keyword: '',
    canceled: false,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: TuiModalService,
    private tenantService: TenantService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.getRouterParams();
    this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(() => {
      this.getRouterParams();
    });
  }

  getRouterParams() {
    const promises = [
      this.route.params,
      this.route.queryParams,
    ];

    Observable.combineLatest(promises)
    .subscribe(([pathParams, queryParams]) => {
      this.filter = {...this.filter, canceled: queryParams['canceled'] === 'true'};
      this.uid = pathParams['uid'];
      this.getTenantPageInfo(this.uid);

      const selectedTabIndex = queryParams['idx'];
      this.selectedTabIndex = +selectedTabIndex || this.selectedTabIndex;
    });
  }

  getTenantPageInfo(uid) {
    if (!uid) {
      return;
    }

    const promises = [
      this.tenantService.fetchInfo(uid),
      this.tenantService.fetchTenantsCount({canceled: this.filter.canceled}),
      this.tenantService.fetchAllTenants(this.filter),
    ];

    this.loading = true;
    Observable.forkJoin(promises)
    .subscribe(([tenant, count, tenantList]) => {
      this.tenant = tenant;
      this.tenantsCount = count.count;
      this.submenuItems = this.makeSubMenuItems(tenantList);
      this.loading = false;
    });
  }

  filterChange(checkboxChange = false) {
    this.loading = true;

    this.tenantService.fetchAllTenants(this.filter)
    .subscribe((tenants) => {
      this.submenuItems = this.makeSubMenuItems(tenants);
      this.loading = false;
      if (checkboxChange) {
        let nextUid;
        if (this.submenuItems.length === 0) {
          nextUid = null;
        } else {
          const tenantExisted = this.submenuItems.find(item => item.uid === this.tenant.uid);
          nextUid = !tenantExisted ? this.submenuItems[0].uid : tenantExisted.uid;
        }
        this.refreshTenantPage(nextUid);
      }
    });
  }

  selectedIndexChange(selectedId) {
    this.selectedTabIndex = selectedId;
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    this.router.navigate([`/tenant/detail/${uid}`], { queryParams: { idx: selectedId } })
      .then(_ => _);
  }

  makeSubMenuItems(tenants = []) {
    const submenuItems = tenants.map((tenant) => ({
      name: tenant.name + ' (' + tenant.uid + ')' ,
      url: `/tenant/detail/${tenant.uid}?canceled=${this.filter.canceled}`,
      uid: tenant.uid,
      suffix: this.getTenantSuffix(tenant),
    }));

    return submenuItems;
  }

  deleteTenant(tenant) {
    const config = {
      title: this.translateService.translateKey('TENANT.OVERVIEW.CONFIRM_DELETE'),
      size: 'md',
      data: {
        name: tenant.name,
        uid: tenant.uid,
      },
    };
    this.modal.open(ModalDeleteTenantComponent, config)
    .subscribe((callback) => {
      if (callback) {
        const nextUid = this.findNextUid(this.submenuItems, tenant.uid);
        this.refreshTenantPage(nextUid);
      }
    });
  }

  refreshTenantPage(uid) {
    if (uid) {
      this.router.navigate([`/tenant/detail/${uid}`], {queryParams: {canceled: this.filter.canceled}});
    } else {
      this.modal.confirm({
        title: 'TENANT.DETAIL.HINT',
        message: 'TENANT.DETAIL.NO_TENANT_HINT',
      });
    }
  }

  getTenantSuffix(tenant) {
    let suffix = {};
    switch (tenant.status) {
      case 'CREATING':
        suffix = {
          icon: 'creating',
          color: 'primary',
        };
        break;
      // case 'ACTIVATING':
      //   suffix = {
      //     icon: 'circle',
      //     color: 'success',
      //   };
      //   break;
      case 'BROKEN':
        suffix = {
          icon: 'exclamation-circle',
          color: 'danger',
        };
        break;
      case 'CANCELED':
        suffix = {
          icon: 'trash-circle',
          color: 'default',
        };
        break;
    }

    return suffix;
  }

  findNextUid(tenantList, uid): number | boolean  {
    let curIndex;
    if (tenantList.lenght === 1) {
      return false;
    } else {
      tenantList.find((tenant, index) => {
        if (tenant.uid === uid) {
          curIndex = index;
        }
      });

      return curIndex === (tenantList.lenght - 1) ? tenantList[0].uid : tenantList[curIndex + 1].uid;
    }
  }
}
