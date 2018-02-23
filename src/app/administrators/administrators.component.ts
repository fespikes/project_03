import { Component, OnInit, HostBinding } from '@angular/core';
import { TuiModalService, TuiModalRef, TUI_MODAL_DATA, Pagination } from 'tdc-ui';

import { AddComponent } from './add/add.component';
import { AdministratorsService } from './administrators.service';
import { Filter } from './administrators.model';

@Component({
  selector: 'tec-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.sass'],
})
export class AdministratorsComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  filter = new Filter();
  pagination = new Pagination();
  tableData: any;
  loading = true;

  constructor(
    private modalService: TuiModalService,
    private service: AdministratorsService,
  ) { }

  fetchTableData() {
    this.loading = true;
    this.service.fetchAdministrators(this.pagination).subscribe(response => {
      // TODO: api related changes
      this.tableData = response.data || [];
      this.pagination = response.pagination || {
        'page': 1,
        'total': 3,
        'size': 10,
      };
      this.loading = false;
    });
  }

  openChildModal(size = 'lg') {
    return this.modalService.open(AddComponent, {
      title: '添加管理员',
      size,
    })
    .subscribe((word: string) => {
      console.log(`Your word is: ${word}`);
    });
  }

  ngOnInit() {
    this.fetchTableData();
  }

  removeCurrent(id: number) {
    this.loading = true;
    this.service.deleteAdministrator(id).subscribe(response => {
      this.loading = false;
      this.fetchTableData();
    });
  }
}
