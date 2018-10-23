import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { TuiModalRef, TuiMessageService } from 'tdc-ui';

import { patterns } from '../../shared';
import { AdministratorsService } from '../administrators.service';

@Component({
  selector: 'tec-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass'],
})
export class AddComponent implements OnInit {
  myForm: FormGroup;
  featureUser: any;

  constructor(
    private fb: FormBuilder,
    private modal: TuiModalRef,
    private service: AdministratorsService,
    private message: TuiMessageService
  ) {
  }

  ngOnInit() {
    this.featureUser = this.service.features.user;
    const group = {
      'username': ['', Validators.required],
      'password': ['', Validators.compose([
          Validators.required,
          Validators.pattern(patterns.password),
        ])],
      'fullName': ['', Validators.required],
      'deletable': ['true', Validators.required],
    };

    if (this.featureUser.emailEnabled) {
      group['email'] =  [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.email),
        ])
      ];
    }
    if (this.featureUser.phoneEnabled) {
      group['phone'] =  [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.phone),
        ])
      ];
    }
    this.myForm = this.fb.group(group);

  }

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};
    val.deletable = (value.deletable.indexOf('true') > -1 ? true : false);

    this.service.addAdministrator(val)
      .subscribe(res => {
        this.message.success(res.message);
        this.modal.close('closed');
      }, err => {
        this.message.error(err.message);
      });
  }

}
