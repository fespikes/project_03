import { Component, OnInit, HostBinding } from '@angular/core';
import { Pagination } from 'tdc-ui';

import { NodeService } from './node.service';
import { NodeFilter } from './node.model';

@Component({
  selector: 'tec-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent implements OnInit {

  @HostBinding('class.tui-layout-body') hostClass = true;

  loading = true;

  tableData: any;

  filter = new NodeFilter();

  pagination = new Pagination();

  debounced: any;

  constructor(
    private nodeService: NodeService,
  ) { }

  ngOnInit() {
    this.fetchTableData();
  }

  fetchTableData() {
    this.loading = true;
    this.filter.page = this.pagination.page;
    this.filter.size = this.pagination.size;
    this.nodeService.fetchNodeList(this.filter).subscribe(response => {
      this.tableData = response.data;
      this.pagination = response.pagination;
      this.loading = false;
    });
  }

  parseFloat(i: any, key: string) {
    const resources = i.resources;
    if (!resources) { return ''; }

    const sub = resources[key];
    if (!sub) { return ''; }

    let usage = sub['usage'];
    const unit = sub['unit'];
    let usagePercent = sub['usagePercent'];

    usage = (usage && unit) ? (usage + unit) : '';
    usagePercent = usagePercent ? (usagePercent + '%') : '';
    return usage + ' ' + usagePercent;
  }

}
