import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { TuiModalRef, TuiMessageService  } from 'tdc-ui';
import { patterns } from '../../../shared';
import { TenantService } from '../../tenant.service';

@Component({
  selector: 'tec-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass'],
})
export class AddComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    fb: FormBuilder,
    private modal: TuiModalRef,
    private service: TenantService,
    private message: TuiMessageService,
  ) {
    this.myForm = fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.compose([
          Validators.required,
          Validators.pattern(patterns.password),
        ])],
      'userEmail': ['', Validators.compose([
          Validators.required,
          Validators.email,
        ])],
      'fullName': ['', Validators.required],
      'maxTenantQuantity': '',
      'company': '',
      'department': '',
    });
  }

  ngOnInit() {
  }

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};

    this.service.addTenantAdmin(val).subscribe(res => {
      this.modal.close('closed');
    }, err => {
      console.log('error response');
    });
  }

  closeSelf() {
    this.modal.close('closed');
  }

}
