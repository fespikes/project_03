import { Component, OnInit, HostBinding } from '@angular/core';

import { Pagination } from 'tdc-ui';
import { Service } from '../model/system-model';
import { SystemService } from '../service/system.service';

@Component({
  selector: 'tec-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.sass'],
})
export class SystemComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  loading;
  keyword = '';

  services: Service[];

  pagination = new Pagination();

  constructor(
    private system: SystemService,
  ) { }

  ngOnInit() {
    this.getServiceList().subscribe();
  }

  getServiceList() {
    this.loading = true;
    return this.system.getServiceList(this.pagination)
      .map(result => {
          this.services = result.data;
          this.pagination = result.pagination;
          this.loading = false;
        },
      );
  }

  getServiceYamls() {

  }

  editYarml() {

  }

  updateImage() {

  }

  deleteService() {

  }

  search() {
  }

  paginationChange() {
    this.getServiceList().subscribe();
  }

}
