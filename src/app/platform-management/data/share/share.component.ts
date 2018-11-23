import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Pagination, TuiModalService, TuiModalRef, TUI_MODAL_DATA, TuiMessageService } from 'tdc-ui';
import { TranslateService } from 'app/i18n/translate.service';
import { DataService } from '../data.service';

@Component({
  selector: 'tec-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.sass']
})
export class ShareComponent implements OnInit {
  service: any;
  cancelDisabled: string;
  instances: any[] = [];
  pagination: Pagination = new Pagination();

  constructor(
    @Inject(TUI_MODAL_DATA) data,
    private fb: FormBuilder,
    private modal: TuiModalRef,
    private api: DataService,
    private message: TuiMessageService,
    private translater: TranslateService,
  ) {
    this.service = data.service;
    this.instances = data.service.usingInstances;
    this.pagination = {
      page: 1,
      size: 10,
      total: this.instances.length
    };
  }

  ngOnInit() {
    this.fetchUsingInstances();
    this.cancelDisabled = this.service.usingInstances.length > 0 ? 'disabled' : '';
  }

  fetchUsingInstances() {
    console.log(this.pagination);
    this.api.fetchUsingInstances(this.service.name, this.pagination)
      .subscribe( res => {
        this.instances = res.data;
      });
  }

  changeSharingStatus(argu?) {
    this.service.shareStatus = argu;
    if (argu === 'SHARED') {
      this.service.shareStatusAlias = '共享';
    } else {
      this.service.shareStatusAlias = '不共享';
    }

    this.api.changeSharing(this.service.name, {
      description: '',
      status: 'SHARED'
    });
  }

  submit(desc: HTMLInputElement) {
    const operation = {
      description: desc.value,
      status: this.service.shareStatus
    };
    this.api.changeSharing(this.service.name, operation)
      .subscribe( res => {
        this.message.success(res.message);
        this.modal.close('closed');
      }, err => {
        console.log('error happens');
      });
  }

  paginationChange() {
    this.fetchUsingInstances();
  }

}
