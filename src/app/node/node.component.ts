import { Component, OnInit, HostBinding } from '@angular/core';
import { Pagination } from 'tdc-ui';
import debounce from 'lodash/debounce';

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

  search: any;

  filter = new NodeFilter();

  pagination = new Pagination();

  debounced: any;

  constructor(
    private nodeService: NodeService,
  ) { }

  ngOnInit() { console.log(debounce);

    this.debounced = debounce(
      () => {
        this.nodeService.fetchNodeList(this.filter).subscribe(response => {
          this.tableData = response.data.data;
          this.pagination = response.data.pagination;
          this.loading = false;
        });
      }, 300, {
        'leading': true,
        'trailing': false,
      },
    );

    this.debounced();
  }

  fetchTableData() {
    this.loading = true;
    this.debounced();
  }

  onSearch(fromStart = false) {
    // 需要后端接口支持搜索
  }

  parseFloat(i: any, key: string) {
    const resources = i.resources;
    if (!resources) { return ''; }

    const sub = resources[key];
    if (!sub) { return ''; }

    let usage = sub['usage'];
    let usagePercent = sub['usagePercent'];

    usage = usage ? (Math.round(usage / 1e4) / 100 + 'G') : '';
    usagePercent = usagePercent ? (usagePercent + '%') : '';
    return usage + ' ' + usagePercent;
  }

}
