import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tec-tenant-instance',
  templateUrl: './tenant-instance.component.html',
  styleUrls: ['./tenant-instance.component.sass'],
})
export class TenantInstanceComponent implements OnInit {
  loading;
  instances = [];

  filter = {
    status: '',
    keyword: '',
  };

  statuses = ['运行中'];
  constructor() { }

  ngOnInit() {
  }

  filterChange() {}

  search() {}

}
