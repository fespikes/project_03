
import {map} from 'rxjs/operators';
import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TuiModalRef, TUI_MODAL_DATA, TuiModalService } from 'tdc-ui';
import { SystemService } from '../../service/system.service';
import { ServiceImage } from '../../model/system-model';

@Component({
  selector: 'tec-modal-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.sass'],
})
export class ModalImageDetailComponent implements OnInit {

  service: string;
  uid: number;
  microService: string;
  image: ServiceImage;

  constructor(
    private modalRef: TuiModalRef,
    private modalService: TuiModalService,
    private system: SystemService,
    @Inject(TUI_MODAL_DATA) data,
  ) {
    this.service = data.service.name;
    this.microService = data.microService.name;
    this.uid = data.uid;
  }

  ngOnInit() {
    this.getServiceImage().subscribe();
  }

  getServiceImage() {
    return this.system.getServiceImages(this.service, this.microService, this.uid).pipe(
    map(result => {
      this.image = Object.assign(result, {
        serviceName: this.service,
        microServiceName: this.microService,
      });
    }));
  }

  confirm() {
    this.system.updateServiceImage(this.image, this.uid)
    .subscribe(() => {
      this.modalRef.close();
    });
  }

  cancel() {
    this.modalRef.close();
  }
}
