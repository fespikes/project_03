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
import { addingTypes, TenantInfo } from '../../tenant-model';

@Component({
  selector: 'tec-send-register-link',
  templateUrl: './send-register-link.component.html',
  styleUrls: ['./send-register-link.component.sass'],
})
export class SendRegisterLinkComponent implements OnInit {
  myForm: FormGroup;
  registerTypes = addingTypes;
  registerType = addingTypes['email'];

  constructor(
    private fb: FormBuilder,
    private modal: TuiModalRef,
    private service: TenantService,
    private message: TuiMessageService,
  ) {
  }

  ngOnInit() {
    this.getFormGroup();
  }

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};

    this.service.sendRegisterLink(val).subscribe(res => {
      this.message.success(res.message);
      this.modal.close('closed');
    }, err => {
      console.log('error response');
    });
  }

  closeSelf() {
    this.modal.close('closed');
  }

  getFormGroup() {
    this.myForm = this.fb.group(TenantInfo.getRegisterFormGroup(this.registerType));
  }

  typeChange(type) {
    if (this.registerType === type) {
      return;
    }
    this.registerType = type === this.registerTypes['phone'] ?
      this.registerTypes['phone'] : this.registerTypes['email'];
    this.getFormGroup();
  }
}
