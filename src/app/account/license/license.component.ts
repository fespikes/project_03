import { Component, OnInit, HostBinding } from '@angular/core';

import { TuiModalService } from 'tdc-ui';
import { TranslateService } from '../../i18n';
import { UploadComponent } from './upload/upload.component';

import { AccountService } from '../account.service';

@Component({
  selector: 'tec-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.sass']
})
export class LicenseComponent implements OnInit {
  // @HostBinding('class.tui-layout-body') hostClass = true;
  license: any = {};
  componentsLeft: any[] = [];
  componentsRight: any[] = [];

  constructor(
    private service: AccountService,
    private modalService: TuiModalService,
    private translateService: TranslateService,
  ) { }

  stringify = JSON.stringify;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const components = [];
    let len = 0;
    this.service.fetchLicenseDetails()
      .subscribe(res => {
        this.license = res;
        len = Math.floor(res.components.length / 2) + 1;
        this.componentsLeft = res.components.slice(0, len);
        this.componentsRight = res.components.slice(len, res.components.length);
      });
  }

  upload(size = 'md') {
    return this.modalService.open(UploadComponent, {
      title: this.translateService.translateKey('上传许可证'),
      size,
    })
      .subscribe((word: string) => {
        this.fetchData();
      });
  }

}
