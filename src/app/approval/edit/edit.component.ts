import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { TuiModalRef, TUI_MODAL_DATA, TuiMessageService } from 'tdc-ui';

import { ApprovalService } from '../approval.service';
// import { assignees } from './assignees.mock';

@Component({
  selector: 'tec-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {
  myForm: FormGroup;
  id: string;
  assignees: any[]; // assignee options from api
  assigneesObj: object = {};
  group: any;
  names: any;

  resultList: any[] = [];
  resultObject: object = {};

  // ifFirstFlag = false;
  // currentIndex: number;

  constructor(
    private message: TuiMessageService,
    private service: ApprovalService,
    private fb: FormBuilder,
    private modal: TuiModalRef,
    @Inject(TUI_MODAL_DATA) private data: any  // assignees from flow
  ) { }

  ngOnInit() {

    this.id = this.data.id;
    this.names = this.data.assignees;
    this.resultList.length = this.names.length;

    // S:TODO: remove mock
    // this.assignees = [...assignees];
    // E:TODO: remove mock
    // TODO: resolve bug of the first blank when adding

    this.assignees = [];
    this.buildForm();
    this.service.getAssignees()
      .subscribe(res => {
        this.assignees = res;
        this.buildForm();
      });
  }

  buildForm() {
    this.assignees.forEach(item => {
      this.assigneesObj[item.name] = item;
    });
    this.group = {};
    this.names.forEach(name => {
      this.group[name] = ['', Validators.required];
    });

    this.myForm = this.fb.group(this.group);
  }

  getControl(name) {
    return this.myForm.controls[name];
  }

  getCurrentModel(name, idx) {
    // must have only one
    const only = this.assignees.filter(item => item.name === name)[0];

    // if (this.ifFirstFlag && idx > this.currentIndex  ) {
      // this.ifFirstFlag = false;
    //   return '';
    // }

    if (!!only) {
      this.resultList[idx] = only;
      this.resultObject[only.name] = only;
      return only['name'];
    } else {
      return '';
    }
  }

  doModelChange($event, item, idx) {
    // 0, 1 ~ this.names.length, this.assignees.length
/*     if (idx + 1 === this.assignees.length) {
      this.message.info('please edit upper assignees first');
      return;
    } */

/*     this.currentIndex = idx;
    if (idx === 0 ) {
      this.ifFirstFlag = true;
    } else {
      this.ifFirstFlag = false;
    }
 */
    let i;

    this.assignees.forEach((it, x) => {
      if (it.name === $event) {
        i = x;
      }
    });
    this.assignees.splice(i, 1);
  }

  addAssignee($event) {
    /**
     * case1: have no options avaliable, can not add
     * case2: have options, use the avaliable first one to
     *    add to names stack, so get availables first
     */
    const availables = this.getAvailables();
    if (availables.length === 0) {
      this.message.info('审批人数量已经达到上限请先新增管理员');
      return;
    }

    this.names.push(availables[0]['name']);
    this.resultList.push(availables[0]);
    this.buildForm();
  }

  getAvailables() {
    if (this.assignees.length <= this.names.length) {
      return [];
    }
    const availables = this.assignees.filter(item => {
      return !this.resultObject[item.name];
    });
    return availables;
  }

  // no api call
  removeAssignee(name, idx) {
    this.names.splice(idx, 1);
    this.resultList.splice(idx, 1);
    delete this.resultObject[name];
  }

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};
    const assigneesHere = [];
    this.names.forEach(name => {
      assigneesHere.push(this.assigneesObj[val[name]]);
    });

    this.service.editAssigneesRecursivly(this.id, assigneesHere)
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
