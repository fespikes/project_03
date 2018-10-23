import { Component, OnInit, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { Router, Route, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { TuiModalRef, TuiMessageService } from 'tdc-ui';

import { BPMSTaskDetail } from '../approval.model';
import { ApprovalService } from '../approval.service';
// import { data } from './task.mock';

@Component({
  selector: 'tec-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.sass']
})
export class TaskComponent implements OnInit {
  loading = false;
  @HostBinding('class.tui-layout-body') hostClass = true;
  @ViewChild('comments') comments: ElementRef;
  id: string;
  executions: any[] = [];
  last: any;
  order: number; // the order of the last execution

  details: any = new BPMSTaskDetail;
  isDisabled = true;

  constructor(
    private service: ApprovalService,
    private route: ActivatedRoute,
    private message: TuiMessageService
  ) { }

  ngOnInit() {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    // this.details = data;

    this.service.getTaskDetails(id)
      .subscribe(res => {
        this.details = {...res};
        this.executions = this.details.executions;
        this.last = this.executions[this.executions.length - 1];
        this.order = this.last['order'];    // TODO: to be confirmed, the last on is pending
        this.loading = false;
      });
  }

  goBack($event) {
    window.history.back();
  }

  textareaChanged($event) {
    if (this.comments.nativeElement.value) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  onSubmit(actionType) {
    this.isDisabled = true;
    this.service.taskAdjustment(this.id, {
      action: actionType,
      requestDescription: this.comments.nativeElement.value
    }).subscribe(res => {
      this.isDisabled = false;
      this.message.success(res.message);
    }, err => {
      this.isDisabled = false;
      this.message.error(err.error);
    });
  }
}
