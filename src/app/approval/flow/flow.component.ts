import { Component, OnInit, HostBinding } from '@angular/core';
import { TuiModalService, TuiModalRef, TUI_MODAL_DATA, Pagination } from 'tdc-ui';
import { TranslateService } from '../../i18n';
import { ApprovalService } from '../approval.service';
import { EditComponent } from '../edit/edit.component';
import { applyType } from '../approval.model';

// import { procedures } from './procedures.mock';

@Component({
  selector: 'tec-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.sass']
})
export class FlowComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;
  items: any[];

  constructor(
    private modalService: TuiModalService,
    private service: ApprovalService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    // this.items = procedures;
     this.service.getProcedures()
    .subscribe(res => {
      this.items = res;
    });
  }

  edit(item, size = 'md') {
    let title = '';
    switch (item.type) {
      case applyType.PROJECT_APPLY:
        title = '项目申请审批人';
        break;
      case applyType.QUOTA_APPLY:
        title = '资源配额申请审批人';
        break;
      default:
        break;
    }
    return this.modalService.open(EditComponent, {
      title: this.translateService.translateKey(title),
      size,
      data: {
        assignees: item.assignees,
        id: item.id
      },
    })
    .subscribe((word: string) => {
      this.fetchData();
    });
  }
}
