import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tec-tenant-error',
  templateUrl: './tenant-error.component.html',
  styleUrls: ['./tenant-error.component.sass'],
})
export class TenantErrorComponent implements OnInit {
  loading;
  errors = [];

  filter = {
    status: '',
    keyword: '',
  };

  date = {
    startDate: '',
    endDate: '',
  };
  constructor() { }

  ngOnInit() {
  }

  search() {}

  delete() {}

  dateChange(value, type) {}

}
