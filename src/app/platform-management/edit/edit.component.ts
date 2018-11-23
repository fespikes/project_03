import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { TuiModalService, TuiModalRef, TUI_MODAL_DATA, TuiMessageService } from 'tdc-ui';
import { TranslateService } from 'app/i18n/translate.service';
import { SystemModuleService } from '../system/system.service';
import { EditService } from './edit.service';

@Component({
  selector: 'tec-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {
  myForm: FormGroup;
  quotas: any[] = [];
  from: string;

  constructor(
    @Inject(TUI_MODAL_DATA) data,
    private fb: FormBuilder,
    private modal: TuiModalRef,
    private service: SystemModuleService,
    private editService: EditService,
    private message: TuiMessageService,
    private translater: TranslateService,
  ) {
    this.myForm = this.fb.group({});
    this.from = data.from;
  }

  ngOnInit() {
    const cb = res => {
      const quotas = [...res];
      this.buildForm(quotas);
    };
    if (this.from === 'data') {
      this.editService.dataQuotas()
        .subscribe(cb);
    } else {
      this.editService.servicesQuotas()
        .subscribe(cb);
    }
  }

  buildForm(quotas) {
    this.quotas = quotas;
    const fields = {};
    quotas.forEach(item => {
      fields[item.name] = this.fb.group({
        cpu: [item.cpu.request ],
        memory: [item.memory.request ]
      });
    });
    this.myForm = this.fb.group(fields);
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    const val = this.myForm.value;
    const result = [];
    let instance = {};
    this.quotas.forEach( item => {
      instance = val[item.name];
      result.push({...instance, namespace: item.name});
    });
    this.editService.servicesQuotas('put', result)
      .subscribe( res => {
        this.message.success(res.message);
        this.modal.close('closed');
      }, err => {
        this.myForm.reset();
        this.message.error(err.message);
      });
  }

  close() {
    this.modal.close();
  }

}
