import { Component, OnInit, HostBinding } from '@angular/core';

import { Pagination } from 'tdc-ui';

@Component({
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.sass'],
})
export class TenantListComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  loading;
  keyword = '';

  tenants = [];

  pagination = new Pagination();

  constructor() { }

  ngOnInit() {
  }

  search() {
    //
  }

  paginationChange() {}

}
