import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';


import { TuiModalRef } from 'tdc-ui';

import { patterns } from 'app/shared';
import { TranslateService } from 'app/i18n';
import { TenantService } from '../../../tenant.service';
import { policies, protocols } from '../tenant-network-model';

@Component({
  selector: 'tec-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass'],
})
export class AddComponent implements OnInit {
  myForm: FormGroup;
  networkName: string;
  // TODO: get it from API
  policies: Array<string>;
  policy: string;
  protocols: Array<string>;
  protocol: string;

  constructor(
    private fb: FormBuilder,
    private modal: TuiModalRef,
    private service: TenantService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.policies = policies;
    this.policy = policies[0];
    this.protocols = protocols;
    this.protocol = protocols[1];

    this.myForm = this.fb.group({
      'policy': [policies[0], Validators.required],
      'protocol': [protocols[0], Validators.required],
      'port': ['', Validators.required],    // number
      'address': [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      'description': [''],
    });
  }

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};
    const networkName = this.service.networkName;

    this.service.addSecurityRule(networkName, val)
      .subscribe(res => {
        this.modal.close('closed');
      });
  }
}
