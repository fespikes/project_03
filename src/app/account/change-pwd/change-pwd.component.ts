import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { TuiModalRef } from 'tdc-ui';
import { patterns } from '../../shared';

import { AccountService } from '../account.service';

@Component({
  selector: 'tec-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.sass'],
})
export class ChangePwdComponent implements OnInit {

  myForm: FormGroup;

  loading = false;

  params: any = {
    oldPassword: '',
    newPassword: '',
    confirm: '',
  };

  test: string;

  constructor(
    fb: FormBuilder,
    private modal: TuiModalRef,
    private accountService: AccountService,
  ) {
    const me = this;

    this.myForm = fb.group({
      'oldPassword': ['', Validators.required],
      'newPassword': [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.password),
          function(control: FormControl) {
            return me.confirmValidator.bind(me)(control, 'oldPassword');
          },
        ]),
      ],
      'confirm': [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.password),
          function(control: FormControl) {
            return me.confirmValidator.bind(me)(control, 'newPassword', true);
          },
        ]),
      ],
    });
  }

  confirmValidator(control: FormControl, target: string, inverse?: boolean): { [s: string]: boolean } {
    if (inverse && (control.value !== this.params[target])) {
      return {invalidCompare: true};
    } else if (control.value === this.params[target] && !inverse) {
      return {invalidCompare: true};
    }
  }

  ngOnInit() {}

  onSubmit(value: {[s: string]: string}) {
    delete value.confirm;
    this.accountService.changePWD({...value}).subscribe(res => {
      this.modal.close('closed');
    });
  }

}
