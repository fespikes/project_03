import { Injectable } from '@angular/core';

import { TranslateService } from 'app/i18n';
import { TuiModalService, TuiModalConfig } from 'tdc-ui';
import {
  ModalYamlDetailComponent,
  ModalPodDetailComponent,
  ModalImageDetailComponent,
} from '../modal';

@Injectable()
export class SystemModalService {

  constructor(
    private modal: TuiModalService,
    private translate: TranslateService,
  ) {}

  openYamlModal(service, uid = null) {
    const config = {
      title: `${this.translate.translateKey('SYSTEM.POPUP.YAML_FILE')}`,
      size: 'md',
      data: {
        service: service,
        uid: uid,
      },
    };

    return this.modal.open(ModalYamlDetailComponent, config);
  }

  openImageModal(service, microService, uid = null) {
    const config = {
      title: `${this.translate.translateKey('SYSTEM.POPUP.IMAGE_INFO')}`,
      size: 'md',
      data: {
        service: service,
        microService: microService,
        uid: uid,
      },
    };

    return this.modal.open(ModalImageDetailComponent, config);
  }

  openPodModal(pod, uid = null) {
    const config = {
      title: `${this.translate.translateKey('SYSTEM.POPUP.POD_DETAIL')}`,
      size: 'lg',
      data: {
        pod: pod,
        uid: uid,
      },
    };

    return this.modal.open(ModalPodDetailComponent, config);
  }

}
