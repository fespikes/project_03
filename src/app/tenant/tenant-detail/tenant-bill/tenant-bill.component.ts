import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tec-tenant-bill',
  templateUrl: './tenant-bill.component.html',
  styleUrls: ['./tenant-bill.component.sass'],
})
export class TenantBillComponent implements OnInit {
  loading;
  keyword;

  bills = [];
  constructor() { }

  ngOnInit() {
  }

  search() {}

}
