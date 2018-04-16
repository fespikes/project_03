import { Component, OnInit, HostBinding } from '@angular/core';
import { Pagination } from 'tdc-ui';

import { TecApiService } from 'app/shared';
import { NodeService } from './node.service';
import { NodeFilter } from './node.model';

const FileSaver = require('../tenant/tenant-list/FileSaver');

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
    private api: TecApiService,
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

  export() {
    this.api.getFile('nodes/export')
    .subscribe((data) => {
      const fileBlob = new Blob([data], {type: 'application/vnd.ms-excel'});
      FileSaver.saveAs(fileBlob, 'nodes.xls');
    });
  }

}
