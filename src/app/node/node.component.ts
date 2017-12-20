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

  private tableData = [
    {id: 3, name: 'fish', type: 'no-limb', desc: 'blue'},
  ];

  private constantData ;

  private total;
  private current: any;
  private search: any;

  private filter = new NodeFilter;

  pagination = new Pagination();

  debounced: any;

  constructor(
    private nodeService: NodeService
  ) { }

  ngOnInit() {

    this.nodeService.fetchNodeList().subscribe(response=>{
      this.constantData = this.tableData = response.data.data;
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

  //search name in loaded data
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

    this.tableData = this.constantData.filter((datum) => {
      let match = true;

      if (this.search) {
        match = match && !!~datum.name.indexOf(this.search);
      }

      return match;
    })
    .slice(start, start + size);

    this.pagination = {
      ...this.pagination,
      total: this.total
    };
  }

  paginationChange() {
    this.filter.page = this.pagination.page;
    this.filter.size = this.pagination.size;
    this.fetchTableData();
  }

  hideLoading() {
    this.loading = false;
  }

}
