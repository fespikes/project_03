import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { TuiModalRef, TUI_MODAL_DATA, TuiMessageService } from 'tdc-ui';

import { ApprovalService } from '../approval.service';
import { assignees } from './assignees.mock';

@Component({
  selector: 'tec-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {
  myForm: FormGroup;
  procedureId: string;

  assignees: any[]; // assignee options from api

  group: any;
  flowAssignees: any;

  resultObject: object = {};

  ifFirstFlag = true;

  constructor(
    private message: TuiMessageService,
    private service: ApprovalService,
    private fb: FormBuilder,
    private modal: TuiModalRef,
    @Inject(TUI_MODAL_DATA) private data: any  // assignees from flow
  ) { }

  ngOnInit() {
    this.procedureId = this.data.procedureId;
    this.flowAssignees = this.data.assignees;

    // S:TODO: remove mock
/*     this.assignees = [...assignees];
    this.buildForm(); */
    // E:TODO: remove mock

    this.assignees = [];
    this.buildForm();
    this.service.getAssignees()
      .subscribe(res => {
        this.assignees = [...res];
        this.buildForm();
      });
  }

  buildForm() {
    this.group = {};
    this.flowAssignees.forEach(assignee => {
      // use addignee's id as field name
      this.group[assignee.id] = [ assignee, Validators.required];
    });

    this.myForm = this.fb.group(this.group);
  }

  getControl(assignee) {
    return this.myForm.controls[assignee.id];
  }

  // store it to object and ready for get availables;
  getCurrentModel(assignee, idx) {
    // must have only one
    const only = this.assignees.filter(item => item.id === assignee.id)[0];
    if (!!only) {
      this.resultObject[only.id] = only;
      return only;
    } else {
      return '';
    }
  }

  /**
   * case1: have no options avaliable, can not add
   * case2: have options, use the avaliable first one to
   *    add to flowAssignees stack, so get availables first
   */
  addAssignee($event) {
    const available = this.getFirstAvailable();
    if (available.length === 0) {
      this.message.info('审批人数量已经达到上限请先新增管理员');
      return;
    }

    this.flowAssignees.push(available);
    this.buildForm();
  }

  getFirstAvailable() {
    if (this.assignees.length <= this.flowAssignees.length) {
      return [];
    }
    const availables = this.assignees.filter(item => {
      return !this.resultObject[item.id];
    });
    return availables[0];
  }

  // no api call
  removeAssignee(name, idx) {
    this.flowAssignees.splice(idx, 1);
    delete this.resultObject[name];
    this.buildForm();
  }

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};
    const assigneeIds = [];
    let rightOrderId, currentField, id;

    for (let i = 0; i < this.flowAssignees.length; i++) {
      rightOrderId = this.flowAssignees[i]['id'];
      currentField = val[rightOrderId];
      id = currentField['id'];
      if (assigneeIds.indexOf(id) > -1) {
        this.message.error('审批人不能重复，请重新设置');
        return;
      }
      assigneeIds.push(id);
    }

    this.service.editAssigneesRecursivly(this.procedureId, assigneeIds)
      .subscribe(res => {
        this.message.success(res.message);
        this.closeSelf();
      }, err => {
        this.message.error(err.message);
        this.closeSelf();
      });
  }

  closeSelf() {
    this.modal.close('closed');
  }
}
