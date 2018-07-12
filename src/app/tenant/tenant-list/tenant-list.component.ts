import { Component, OnInit, HostBinding } from '@angular/core';
import { Pagination, TuiModalService } from 'tdc-ui';

import { TenantFilter } from '../tenant-model';
import { TenantService } from '../tenant.service';
import { TranslateService } from 'app/i18n';
import { TecApiService } from 'app/shared';
import { TenantSummary, statuses, TenantInfo } from '../tenant-model';
import { ModalDeleteTenantComponent } from '../components/modal/delete-tenant.component';
import { FailureCourseComponent } from '../components/failure-course/failure-course.component';

const FileSaver = require('./FileSaver');

@Component({
  selector: 'tec-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.sass'],
})
export class TenantListComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  loading;
  tenantsCount = 0;
  statuses = statuses;
  filter = new TenantFilter();

  tenants: TenantSummary[];

  pagination = new Pagination();

  constructor(
    private tenantService: TenantService,
    private modalService: TuiModalService,
    private translateService: TranslateService,
    private api: TecApiService,
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

  export() {
    this.api.getFile('tenants/summaries/export')
    .subscribe((data) => {
      const fileBlob = new Blob([data], {type: 'application/vnd.ms-excel'});
      FileSaver.saveAs(fileBlob, 'tenants.xls');
    });
  }

  viewFailureCourse(tenant: TenantInfo) {
    const config = {
      title: this.translateService.translateKey('TENANT.FAILURE_CAUSE'),
      size: 'md',
      data: {
        msg: tenant.failure,
        nameStr: tenant.name + ' (' + tenant.uid + ')',
      },
    };
    this.modalService.open(FailureCourseComponent, config)
      .subscribe(_ => _);
  }

}
