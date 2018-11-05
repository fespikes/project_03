import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { TuiMessageService, TuiModalRef, TUI_MODAL_DATA } from 'tdc-ui';

import { NodeService } from '../node.service';
import { TranslateService } from '../../i18n/translate.service';

@Component({
  selector: 'tec-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.sass'],
})
export class EditTagsComponent implements OnInit {
  loading = false;
  myForm: FormGroup;
  tags: string[] = [];
  keys: string[] = [];
  name: string;

  constructor(
    private ele: ElementRef,
    fb: FormBuilder,
    @Inject(TUI_MODAL_DATA) private data: any,
    private modal: TuiModalRef,
    private message: TuiMessageService,
    private translateService: TranslateService,
    public service: NodeService
  ) {
    const me = this;

    this.myForm = fb.group({
      'value': ['', Validators.required],
      'key': ['', Validators.required],
    });
  }

  ngOnInit() {
    this.tags = this.data.tags;
    this.keys = this.data.keys;
    this.name = this.data.name;
    this.service.nodeDetailsObservable
      .subscribe(node => {
        this.tags = node.tags;
        this.keys = node.keys;
        this.name = node.name;
      });
  }

  deleteTag(idx: number) {
    this.loading = true;
    this.service.removeLabel(this.keys[idx], this.name)
    .subscribe(res => {
      this.message.success(res.message);
      this.loading = false;
      this.tags.splice(idx, 1);
      this.keys.splice(idx, 1);
      this.service.manipulateNodeDetails({
        tags: this.tags,
        keys: this.keys,
        name: this.name
      });
    });
  }

  onSubmit(val: {[s: string]: string}) {
    this.loading = true;
    this.service.addNodeLabel(val, this.name)
      .subscribe(res => {
        this.message.success(res.message);
        this.loading = false;
/*         setTimeout(argu => {
          this.modal.close('closed');
        }, 3000); */
        this.tags.splice(0, 0, val.key + '=' + val.value);
        this.keys.splice(0, 0, val.key);
        this.service.manipulateNodeDetails({
          tags: this.tags,
          keys: this.keys,
          name: this.name
        });
      });
  }
/*   onSubmit(key: HTMLInputElement, val: HTMLInputElement) {
    console.log(key.value, val.value);
  } */

  keyMouseout($event: MouseEvent) {
    const target: any = $event.target;
    // const val = this.ele.nativeElement.querySelector('#valueId');
    const key = this.myForm.get('key');

    if (this.keys.indexOf(target.value) >= 0 ) {
      // this.message.error('key已经存在，请重新输入');
      // target.value = '';
      requestAnimationFrame(argu => {
        key.setValue('');
        key.setErrors({exis: true});
      });
    }
  }

}
