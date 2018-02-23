import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { TuiModalRef } from 'tdc-ui';

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
          Validators.pattern(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,8}$/),
        ])],
      'fullName': ['', Validators.required],
      'email': [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/),
        ]),
      ],
      'deletable': ['true', Validators.required],
    });
  }

  ngOnInit() {
    const me = this;
    this.myForm.valueChanges.subscribe((form: any) => {
      console.log(me.myForm.value, me.myForm);
    });
  }

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};
    val.deletable = (value.deletable.indexOf('true') > -1 ? true : false);

    this.administratorsService.addAdministrator(val)
      .subscribe(response => {
        this.modal.close('closed');
      });
  }

}
