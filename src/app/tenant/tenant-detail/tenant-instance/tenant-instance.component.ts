import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { TenantService } from 'app/tenant/tenant.service';
import { Pagination, TuiModalService } from 'tdc-ui';

@Component({
  selector: 'tec-tenant-instance',
  templateUrl: './tenant-instance.component.html',
  styleUrls: ['./tenant-instance.component.sass'],
})
export class TenantInstanceComponent implements OnInit {
  @Input() uid: string;
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
    this.fetchInstances().subscribe();
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
    return this.tenantService.fetchInstanceInfos(this.uid, this.pagination, this.filter)
      .pipe(map((result) => {
        this.instances = result.data;
        this.pagination = result.pagination;
        this.loading = false;
      }));
  }

}
