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

  filter = new NodeFilter;

  private select;

  pagination = new Pagination();

  debounced: any;

  constructor(
    private nodeService: NodeService
  ) { }

  ngOnInit() {

    this.nodeService.fetchNodeList().subscribe(response=>{
      this.tableData = response.data.data;
      this.total = response.data.pagination.total;
      // this.pagination = response.data.pagination;
      this.hideLoading();
    });

  }

  fetchTableData(filter?) {
    this.loading = true;

    console.log('this.filter:', this.filter);

    this.debounced = debounce(
      ()=>{
        this.nodeService.fetchNodeList(this.filter).subscribe(response=>{
          this.tableData = response.data.data;
          this.total = response.data.pagination.total;
          // this.pagination = response.data.pagination;
          this.hideLoading();
        })
      }, 300, {
        'leading': true,
        'trailing': false
      }
    );
    this.debounced();
  }
  
  onFilterSelectStatus($event: string) {
    this.filter.status = $event;
    this.fetchTableData();
  }

  onFilterSelectNewJoined($event: boolean) {
    $event? (this.filter.newJoined = true)
      : (delete this.filter.newJoined) ;
    this.fetchTableData();
  }

  onFilterReset($event) {
    this.filter.reset();
    this.hideLoading();
    // this.debounced.cancel();
    this.fetchTableData();
  }

  onReselect($event: number) {
    this.filter.coreNum = $event;
    this.fetchTableData();
  }

  //search current page data
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
  }

  paginationChange() {

  }

  hideLoading() {
    this.loading = false;
  }

}
