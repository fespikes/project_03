import { Component, OnInit, HostBinding } from '@angular/core';

import { Pagination } from 'tdc-ui';

@Component({
  selector: 'tec-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.sass'],
})
export class SystemComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  loading;
  keyword = '';

  services = [];

  pagination = new Pagination();

  constructor() { }

  ngOnInit() {
  }

  search() {
  }

  paginationChange() {
  }

}
