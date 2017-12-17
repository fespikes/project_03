import { Component, OnInit, HostBinding } from '@angular/core';
import { Pagination } from 'tdc-ui';

import { NodeService } from './node.service';

@Component({
  selector: 'tec-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent implements OnInit {

  @HostBinding('class.tui-layout-body') hostClass = true;

  backUrl = '../';

  private loading = true;

  tableData = [
    {id: 1, name: 'cat', type: 'limb', desc: 'miao'},
    {id: 2, name: 'dog', type: 'limb', desc: 'wuf'},
    {id: 3, name: 'fish', type: 'no-limb', desc: 'blue'},
  ];
  total;

  current: any;

  search: any;

  private select;

  pagination = new Pagination();

  constructor(
    private nodeService: NodeService
  ) { }

  ngOnInit() {

    this.nodeService.fetchNodeList().subscribe(response=>{
      this.tableData = response.data.data;
      this.total = response.data.pagination.total;
      // this.pagination = response.data.pagination;
      this.loading = false;
    })

  }
  
  selectChange(data) {
    console.log('selectChange', data, 'this.current:', this.current);
  }

  onSearch(fromStart = false) {
    // 如果搜索或者过滤，则重置页码
    if (fromStart) {
      this.pagination = {
        ...this.pagination,
        page: 1,
      };
    }

    // 模仿请求
    const size = this.pagination.size;
    const start = (this.pagination.page - 1) * size;

    this.tableData = this.tableData.filter((datum) => {
      let match = true;
      if (this.search) {
        match = match && !!~datum.name.indexOf(this.search);
      }
      if (this.select) {
        match = match && datum.type === this.select;
      }
      return match;
    })
    .slice(start, start + size);

    this.pagination = {
      ...this.pagination,
      total: this.tableData.length,
    };

    console.log('this.data', this.tableData);
  }

  paginationChange() {

  }

}
