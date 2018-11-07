import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { TuiModalRef, TuiMessageService } from 'tdc-ui';
import { TranslateService } from '../../../i18n/translate.service';
import { AccountService } from '../../account.service';

@Component({
  selector: 'tec-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass']
})
export class UploadComponent implements OnInit {
  isDisabled = true;
  tdhFile: any = {};
  tosFile: any = {};

  constructor(
    private modal: TuiModalRef,
    private service: AccountService,
    private message: TuiMessageService
  ) {}

  ngOnInit() {}

  fileClicked(field) {
    this[field].nativeElement.click();
  }

  handleFileChange(file, type: string, obj?: string) {
    const fileName = file.name;
    this.service.uploadFile(file, type)
      .subscribe(res => {
        console.log(res);
        const data = res.data;
        this.isDisabled = false;
        this[obj].name = data.name;
        this[obj].nameAlias = fileName;
      }, err => {
        this[obj].error = err.message;
      });
  }

  clearField(obj?) {
    this[obj] = {};
    if (Object.keys(this.tdhFile).length === 0 && (Object.keys(this.tosFile).length === 0)) {
      this.isDisabled = true;
    }
  }

  powerOff(msg?) {
    this.modal.close(msg || 'closed');
  }

  onSubmit() {
    const result = [];
    this.isDisabled = true;

    if (this.tdhFile.name) {
      result.push({
        action: 'UPLOAD',
        name: this.tdhFile.name
      });
    }
    if (this.tosFile.name) {
      result.push({
        action: 'UPLOAD',
        name: this.tosFile.name
      });
    }

    this.service.uploadLicenses(result)
      .subscribe(res => {
        this.message.success(res.message);
        setTimeout(argu => {
          this.powerOff();
        }, 3000);
      });
  }

}
