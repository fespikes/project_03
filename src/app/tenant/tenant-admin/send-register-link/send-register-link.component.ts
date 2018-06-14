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
  selector: 'tec-send-register-link',
  templateUrl: './send-register-link.component.html',
  styleUrls: ['./send-register-link.component.sass'],
})
export class SendRegisterLinkComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    fb: FormBuilder,
    private modal: TuiModalRef,
    private service: TenantService,
    private message: TuiMessageService,
  ) {
    this.myForm = fb.group({
      'userEmail': ['', Validators.compose([
          Validators.required,
          Validators.email,
        ])],
      'maxTenantQuantity': '',
    });
  }

  ngOnInit() {
  }

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};

    this.service.sendRegisterLink(val).subscribe(res => {
      this.modal.close('closed');
    }, err => {
      console.log('error response');
    });
  }

  closeSelf() {
    this.modal.close('closed');
  }
}
