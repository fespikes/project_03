import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination, TuiMessageService } from 'tdc-ui';

import { ApprovalService } from '../approval.service';
import { TasksFilter } from '../approval.model';

@Component({
  selector: 'tec-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.sass']
})
export class PendingComponent implements OnInit {
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

  constructor(
    private service: ApprovalService,
    private router: Router,
    private route: ActivatedRoute,
    private message: TuiMessageService
  ) { }

  ngOnInit() {
    this.filter.type = this.types[0]['value'];
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

  typeChange($event) {
    this.filter.type = $event;
    this.filterChange();
  }

  filterChange() {
    this.pagination.page = 1;
    console.log(this.filter.keyword);
    this.getTasks();
  }

  goDetails(task) {
    this.router.navigate(['/approval/task', {id: task.id}]);
    // this.router.navigate([`/approval/task`], { queryParams: {id: task.id} });

  }

}
