import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../i18n';

import { Pagination } from 'tdc-ui';

import { Filter, XNetwork } from './network.model';
import { NetworkService } from './network.service';

@Component({
  selector: 'tec-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.sass']
})
export class NetworkComponent implements OnInit {
  loading = false;
  pagination = new Pagination();
  filter: Filter = new Filter();
  list: Array<XNetwork>;
  idx: number;

  constructor(
    private translateService: TranslateService,
    private service: NetworkService
  ) { }

  ngOnInit() {
    this.fetchData();

  }

  fetchData() {
    this.loading = true;
    this.filter.page = this.pagination.page;
    this.filter.size = this.pagination.size;
    this.service.fetchList(this.filter).subscribe( res => {
      this.pagination = res.pagination;
      this.list = res.data;
      this.loading = false;
    });
  }

}
