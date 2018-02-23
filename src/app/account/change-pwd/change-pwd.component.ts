import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { TuiModalRef } from 'tdc-ui';

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
      'oldPassword': ['', Validators.required],  // [Validators.pattern(/^(.{0,50}\n)*[^\n]{0,50}$/)]],
      'newPassword': [
        '',
        Validators.compose([
          Validators.required,
          // Validators.minLength(6),
          // Validators.maxLength(8),
          Validators.pattern(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,8}$/),
          function(control: FormControl) {
            return me.confirmValidator.bind(me)(control, 'oldPassword');
          },
        ]),
      ],
      'confirm': [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[A-Za-z0-9]{6,8}'),
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

  ngOnInit() {
    const me = this;
    this.myForm.valueChanges.subscribe((form: any) => {
      // TODO
    });

  }

  onSubmit(value: {[s: string]: string}) {
    console.log('submit', value);
    delete value.confirm;
    this.accountService.changePWD({...value}).subscribe(response => {
      this.modal.close('closed');
    });
  }

}
