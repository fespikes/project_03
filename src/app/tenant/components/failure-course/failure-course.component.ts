import { Component, OnInit, Inject } from '@angular/core';
import { TuiModalRef, TUI_MODAL_DATA, TuiModalService } from 'tdc-ui';
import { TenantService } from '../../tenant.service';

@Component({
  selector: 'tec-failure-course',
  templateUrl: './failure-course.component.html',
  styleUrls: ['./failure-course.component.sass'],
})
export class FailureCourseComponent implements OnInit {
  disabled = false;
  message: string;
  nameStr: string;

  constructor(
    private modalRef: TuiModalRef,
    @Inject(TUI_MODAL_DATA) private data: any,
  ) {
    this.message = data.msg;
    this.nameStr = data.nameStr;
  }

  ngOnInit() {
  }

  cancel() {
    this.modalRef.close();
  }
}
