import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs//Rx';

import { TenantService } from 'app/tenant/tenant.service';
import { Pagination, TuiModalService } from 'tdc-ui';

@Component({
  selector: 'tec-tenant-instance',
  templateUrl: './tenant-instance.component.html',
  styleUrls: ['./tenant-instance.component.sass'],
})
export class TenantInstanceComponent implements OnInit {
  @Input() uid: BehaviorSubject<string>;
  loading;
  pagination = new Pagination();
  instances = [];

  filter = {
    status: '',
    keyword: '',
  };

  statuses = [
    'ALL',
    'DEPLOYING',
    'READY',
    'UNDEPLOYED',
    'FATALERROR',
  ];
  constructor(
    private route: ActivatedRoute,
    private tenantService: TenantService,
    private modal: TuiModalService,
  ) { }

  ngOnInit() {
    this.uid
      .asObservable()
      .subscribe((uid) => {
        this.fetchInstances().subscribe();
      });
  }

  filterChange() {
    if (this.filter.status === 'ALL') {
      this.filter.status = '';
    }
    this.fetchInstances().subscribe();
  }

  paginationChange() {
    this.fetchInstances().subscribe();
  }

  fetchInstances() {
    this.loading = true;
    const uid = this.uid.getValue();
    return this.tenantService.fetchInstanceInfos(uid, this.pagination, this.filter)
      .map((result) => {
        this.instances = result.data.data;
        this.pagination = result.data.pagination;
        this.loading = false;
      }, this.modal.apiError);
  }

}
