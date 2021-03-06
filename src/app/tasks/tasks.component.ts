import { Component, OnInit, HostBinding } from '@angular/core';

import { TuiModalRef, TUI_MODAL_DATA, Pagination, TuiMessageService } from 'tdc-ui';
import { TranslateService } from '../i18n';

import { Task } from '../shared';
import { TaskFilter, status } from './tasks.model';
import { TasksService } from './tasks.service';

@Component({
  selector: 'tec-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.sass'],
})
export class TasksComponent implements OnInit {

  @HostBinding('class.tui-layout-body') hostClass = true;

  loading = false;
  pagination = new Pagination();
  tableData: any[] = [];
  filter = new TaskFilter();
  options: any;
  objectOption: string; // any = {};
  status: any = status;
  sortMode: 'single';  // 'multiple'

  constructor(
    private service: TasksService,
    private translateService: TranslateService,
    private message: TuiMessageService,
  ) {}

  ngOnInit() {
    const options = [{
      status: '',
      statusAlias: this.translateService.translateKey('TASKS.ALL'),
    }];
    this.service.getStatus().subscribe(res => {
      res.forEach(item => {
        options.push(item);
      });
      this.options = options;
      this.objectOption = this.options[0]['statusAlias'];
    });

    this.fetchData();
  }

  showRemoved() {
    this.pagination.page = 1;
    this.fetchData();
  }

  fetchData(changes?, fromStart = false) {
    this.loading = true;
    this.filter.page = this.pagination.page;
    this.filter.size = this.pagination.size;

    this.filter.status = this.objectOption;
    if ( this.options && (this.objectOption === this.options[0]['statusAlias'])) {
      this.filter.status = '';
    }

    if (changes && changes.sortedBy) {
      const {sortedBy, order} = changes;
      this.filter.sortedBy = sortedBy;
      this.filter.order = order;
    } else {
      delete this.filter.order;
      delete this.filter.sortedBy;
    }

    return this.service.getTasks(this.filter).subscribe(response => {
      this.tableData = response.data || [];
      this.pagination = response.pagination;
      this.loading = false;
    });

    // TODO: when selected 'removed',checkbox must be checked
  }

  viewDetails(task: Task, size = 'lg') {
    if (!!task.link) {
      window.open(task.link);
    } else {
      this.message.error(this.translateService.translateKey('TASKS.NO_LINK'));  // TODO: i18n
    }
  }

  removeTask(task: Task) {
    this.service.removeTask(task.id).subscribe(res => {
      if (!!res) {
        this.message.success(res);
        this.fetchData();
      } else {
        this.message.error(res.data);
      }
    });
  }

}
