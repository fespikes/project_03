import { Injectable } from '@angular/core';
import 'rxjs/add/operator/mergeMap';

import { TranslateService } from '../../i18n/translate.service';
import { TuiModalService, TuiModalConfig, ConfirmModalConfig } from 'tdc-ui';
import { SystemService } from '../service/system.service';
import { ModalYamlDetailComponent, ModalPodDetailComponent, ModalImageDetailComponent } from './';
import { containsTree, serializePath } from '@angular/router/src/url_tree';

@Injectable()
export class SystemModalService {

  constructor(
    private modal: TuiModalService,
    private system: SystemService,
    private translate: TranslateService,
  ) {}

  openYamlModal(instance) {
    const config = {
      title: `${this.translate.translateKey('SYSTEM.POPUP.YAML_FILE')}`,
      size: 'md',
      data: {
        instance: instance,
      },
    };

    return this.modal.open(ModalYamlDetailComponent, config);
  }

  openImageModal(instance, service) {
    const config = {
      title: `${this.translate.translateKey('SYSTEM.POPUP.IMAGE_INFO')}`,
      size: 'md',
      data: {
        instance: instance,
        service: service,
      },
    };

    return this.modal.open(ModalImageDetailComponent, config);
  }

  openPodModal(pod) {
    const config = {
      title: `${this.translate.translateKey('SYSTEM.POPUP.POD_DETAIL')}`,
      size: 'lg',
      data: {
        pod: pod,
      },
    };

    return this.modal.open(ModalPodDetailComponent, config);
  }

}
