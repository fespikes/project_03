import { Component, OnInit, Inject } from '@angular/core';
import { TuiModalRef, TUI_MODAL_DATA, TuiMessageService } from 'tdc-ui';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NetworkService } from '../network.service';
import { TranslateService } from 'app/i18n/translate.service';

@Component({
  selector: 'tec-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {
  networkName: string;
  myForm: FormGroup;
  networks: any[];
  policyTypes = ['ACCEPT', 'REJECT'];
  protocols = ['TCP', 'UDP'];
  submitDisabled: boolean;

  constructor(
    @Inject(TUI_MODAL_DATA) data,
    fb: FormBuilder,
    private modal: TuiModalRef,
    private service: NetworkService,
    private message: TuiMessageService,
    private translater: TranslateService,
  ) {
    this.networkName = data.networkName;
    this.networks = data.networks;

    this.myForm = fb.group({
      'cidr': ['', Validators.required], // 1.关联网络
      'policy': ['', Validators.required],  // 2.授权策略
      'port': ['', Validators.required],  // 3.端口
      'protocol': ['', Validators.required],  // 4.协议类型
      'description': [''], // 5.规则描述
    });
  }

  ngOnInit() {
    this.fetchEnums();
  }

  fetchEnums() {
    this.service.fetchEnums()
      .subscribe(res => {
      this.networks = res.networks;
      this.policyTypes = res.policies;
      this.protocols = res.protocols;
    });
  }

  onSubmit(value: {[s: string]: string}) {
    const val: any = {...value};
    this.submitDisabled = true;
    this.service.addSecurityRule(this.networkName, val)
      .subscribe(res => {
        this.message.success(res.message);
        this.modal.close('closed');
      }, err => {
        this.submitDisabled = false;
      });
  }

}
