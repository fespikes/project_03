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
          function(control: FormControl) {
            return me.checkEmail.bind(me)(control );
          }
        ]),
      ],
      'deletable': ['true', Validators.required],
    });
  }

  ngOnInit() {}

  checkEmail(control: FormControl): { [s: string]: boolean } {
    const regexp = patterns.notAllowedEmailPattern;
    if (regexp.test(control.value)) {
      console.log(control.valid);
      return {invalidCompare: true};
    } else {
      console.log(control.valid);
      return {invalidCompare: false};
    }
  }

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};
    val.deletable = (value.deletable.indexOf('true') > -1 ? true : false);

    this.administratorsService.addAdministrator(val)
      .subscribe(res => {
        this.modal.close('closed');
      });
  }

}
