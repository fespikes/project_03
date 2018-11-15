import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { TuiModalRef } from 'tdc-ui';

import { patterns } from '../../shared';
import { AdministratorsService } from '../administrators.service';
import { forbiddenEmailValidator } from '../../shared';

@Component({
  selector: 'tec-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass'],
})
export class AddComponent implements OnInit {
  myForm: FormGroup;

  get email() {
    return this.myForm.get('email');
  }

  constructor(
    fb: FormBuilder,
    private modal: TuiModalRef,
    private administratorsService: AdministratorsService,
  ) {
    const me = this;
    this.myForm = fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.compose([
          Validators.required,
          Validators.pattern(patterns.password),
        ])],
      'fullName': ['', Validators.required],
      'email': [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.email),
          forbiddenEmailValidator(patterns.notAllowedEmailPattern)
        ]),
      ],
      'deletable': ['true', Validators.required],
    });

    this.myForm.statusChanges.subscribe(argu => {
      console.log(me.myForm);
    });
    this.myForm.valueChanges.subscribe(argu => {
      console.log(me.myForm);
    });
  }

  ngOnInit() {}

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};
    val.deletable = (value.deletable.indexOf('true') > -1 ? true : false);

    this.administratorsService.addAdministrator(val)
      .subscribe(res => {
        this.modal.close('closed');
      });
  }

}
