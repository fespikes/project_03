import { Component, OnInit, HostBinding } from '@angular/core';
import { Pagination } from 'tdc-ui';


@Component({
  selector: 'tec-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent implements OnInit {

  @HostBinding('class.tui-layout-body') hostClass = true;

  backUrl = '../';

  tableData = [
    {id: 1, name: 'cat', type: 'limb', desc: 'miao'},
    {id: 2, name: 'dog', type: 'limb', desc: 'wuf'},
    {id: 3, name: 'fish', type: 'no-limb', desc: 'blue'},
  ];

  data: any;

  allData: any;

  search: any;

  pagination = new Pagination();

  constructor() { }

  ngOnInit() {
    this.allData = {
      hostAmount: 222,

      tableData: []
    }

  }
  
  selectChange(data) {
    console.log('selectChange', data, 'this.data:', this.data);
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

    this.data = this.allData.filter((datum) => {
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

    // 模仿请求中给pagination赋值
    this.pagination = {
      ...this.pagination,
      total: this.allData.length,
    };

    console.log('this.data', this.allData);
  }

  paginationChange() {

  }

}
