import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TuiModalRef, TUI_MODAL_DATA, TuiModalService } from 'tdc-ui';
import { SystemService } from '../../service/system.service';
import { Image } from '../../model/system-model';

@Component({
  selector: 'tec-modal-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.sass'],
})
export class ModalImageDetailComponent implements OnInit {

  instance: string;
  service: string;
  image: Image;

  constructor(
    private modalRef: TuiModalRef,
    private modalService: TuiModalService,
    private system: SystemService,
    @Inject(TUI_MODAL_DATA) data,
  ) {
    this.instance = data.instance.name;
    this.service = data.service.name;
  }

  ngOnInit() {
    this.getInstanceImage().subscribe();
  }

  getInstanceImage() {
    return this.system.getImages(this.instance, this.service)
    .map(result => {
      this.image = Object.assign(result, {instanceName: this.instance});
    });
  }

  confirm() {
    this.system.updateImage(this.image)
    .subscribe(() => {
      this.modalRef.close();
    }, (error) => {
      this.modalService.apiError(error);
    });
  }

  cancel() {
    this.modalRef.close();
  }
}
