
import {map} from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TuiModalRef, TUI_MODAL_DATA, TuiModalService } from 'tdc-ui';
import { SystemService } from '../../service/system.service';
import * as Mark from 'mark.js';

@Component({
  selector: 'tec-modal-yaml-detail',
  templateUrl: './yaml-detail.component.html',
  styleUrls: ['./yaml-detail.component.sass'],
})
export class ModalYamlDetailComponent implements OnInit {

  serviceName: string;
  keyword: string;
  uid: number;
  yamls:  Object;
  markInstance;

  constructor(
    private modalRef: TuiModalRef,
    private system: SystemService,
    @Inject(TUI_MODAL_DATA) data,
  ) {
    this.serviceName = data.service.name;
    this.uid = data.uid;
  }

  ngOnInit() {
    this.getServiceYaml().subscribe();
  }

  getServiceYaml() {
    return this.system.getServiceYamls(this.serviceName, this.uid).pipe(
    map((result) => {
      this.yamls = this.makeYamlTreeModel(result);
    }));
  }

  highlightKeyword() {
    this.markInstance = !this.markInstance ? new Mark(document.querySelector('.yaml-content')) : this.markInstance;
    this.markInstance.unmark({});
    if (this.keyword) {
      this.markInstance.mark(this.keyword, {});
    }
  }

  makeYamlTreeModel(yaml) {
    const stack = [];
    for (const attr in yaml) {
      if (yaml.hasOwnProperty(attr)) {
        let child = {};
        if (typeof yaml[attr] === 'object') {
          child = {
            name: attr,
            value: JSON.stringify(yaml[attr]),
            children: this.makeYamlTreeModel(yaml[attr]),
          };
        } else {
          child = {
            name: attr,
            value: JSON.stringify(yaml[attr]),
            children: [],
          };
        }
        stack.push(child);
      }
    }
    return stack;
  }

  close() {
    this.modalRef.close();
  }
}
