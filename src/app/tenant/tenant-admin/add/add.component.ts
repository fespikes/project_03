import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';

import { TuiModalRef, TuiMessageService  } from 'tdc-ui';
import { TenantService } from '../../tenant.service';
import { addingTypes, TenantInfo } from '../../tenant-model';

@Component({
  selector: 'tec-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass'],
})
export class AddComponent implements OnInit {
  myForm: FormGroup;
  addType = 'email';
  addingTypes = addingTypes;

  constructor(
    private fb: FormBuilder,
    private modal: TuiModalRef,
    private service: TenantService,
    private message: TuiMessageService,
  ) {}

  ngOnInit() {
    this.getFormGroup();
  }

  getFormGroup() {
    this.myForm = this.fb.group(TenantInfo.getAddingFormGroup(this.addType));
  }

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};

    this.service.addTenantAdmin(val).subscribe(res => {
      this.message.success(res.message);
      this.modal.close('closed');
    }, err => {
      console.log('error response');
    });
  }

  typeChange(type) {
    if (this.addType === type) {
      return;
    }
    this.addType = type === this.addingTypes['phone'] ?
      this.addingTypes['phone'] : this.addingTypes['email'];
    this.getFormGroup();
  }

  closeSelf() {
    this.modal.close('closed');
  }

}
