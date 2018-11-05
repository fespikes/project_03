import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination, TuiMessageService } from 'tdc-ui';

import { ApprovalService } from '../approval.service';
import { TasksFilter } from '../approval.model';

@Component({
  selector: 'tec-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass']
})
export class HistoryComponent implements OnInit {
  loading = false;
  filter: TasksFilter = {};
  pagination = new Pagination();
  tasks: any[];
  types: any[] = [{   // TODO: get it from api: this.service.getTaskTypes()
    label: '所有类型',
    value: '',
  }, {
    label: '资源配额',
    value: 'QUOTA_APPLY',
  }, {
    label: '项目',
    value: 'PROJECT_APPLY',
  }];
  statuses: any[] = [{
    label: '所有状态',
    value: ''
  }, {
    label: '审批中',
    value: 'PENDING',
  }, {
    label: '已拒绝',
    value: 'REJECTED',
  }, {
    label: '已审批',
    value: 'APPROVAL',
  }];

  constructor(
    private service: ApprovalService,
    private router: Router,
    private route: ActivatedRoute,
    private message: TuiMessageService
  ) { }

  ngOnInit() {
    this.filter.type = this.types[0]['value'];
    this.filter.status = this.statuses[0]['value'];
    this.filter.option = 'HISTORY';
    this.getTasks();
  }

  getTasks() {
    this.loading = true;
    this.service.getTasks(this.filter)
      .subscribe((result) => {
        this.tasks = result.data;
        this.pagination = result.pagination || {
          page: 1,
          size: 10
        };
        this.loading = false;
      }, err => {
        this.message.error(err.message);
      });
  }

  goDetails(task) {
    this.router.navigate(['/approval/task', {id: task.id, fromPath: 'history'}]);
  }
}
