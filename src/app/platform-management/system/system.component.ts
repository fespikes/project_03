import { Component, OnInit, HostBinding } from '@angular/core';
import { map } from 'rxjs/operators';

import { Pagination, TuiModalService } from 'tdc-ui';
import { TranslateService } from 'app/i18n';
import { EditComponent } from '../edit/edit.component';

import {
  SystemService,
  SystemModalService,
  Service,
  ServiceFilter,
  ServiceList,
} from 'app/shared';

import { SystemModuleService } from './system.service';

@Component({
  selector: 'tec-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.sass'],
})
export class SystemComponent implements OnInit {
  loading = false;
  labels = [];
  services: Service[];
  filter = new ServiceFilter();
  pagination = new Pagination();

  constructor(
    private system: SystemModuleService,
    private systemService: SystemService,
    private systemModal: SystemModalService,
    private translate: TranslateService,
    private tuiModal: TuiModalService,
  ) { }

  ngOnInit() {
    this.getServiceLabels().subscribe();
    this.getServiceList().subscribe();
  }

  getServiceList() {
    this.loading = true;
    return this.system.getServiceList(this.filter, this.pagination)
    .pipe(map(result => {
      this.services = result.data;
      this.pagination = result.pagination;
      this.loading = false;
    }));
  }

  getServiceLabels() {
    this.loading = true;
    return this.systemService.getServiceLabels()
    .pipe(map(result => {
      this.labels = result.map(label => {
        return {
          value: label,
          label: label,
        };
      });
    }));
  }

  filterChange() {
    this.pagination.page = 1;
    this.getServiceList().subscribe();
  }

  startService(service) {
    this.systemService.startService(service.name, (service.category || {}).uid)
    .subscribe(() => {
      this.getServiceList().subscribe();
    });
  }

  stopService(service) {
    this.systemService.stopService(service.name, (service.category || {}).uid)
    .subscribe(() => {
      this.getServiceList().subscribe();
    });
  }

  getServicePods(service) {
    this.loading = true;
    this.systemService.getServicePods(service.name, (service.category || {}).uid)
    .subscribe((result) => {
      this.mergeServicePods(service.name, result);
      this.loading = false;
    });
  }

  toggleSubList(service) {
    service.showSubList = !service.showSubList;
    this.getServicePods(service);
  }

  viewPod(pod) {
    this.systemModal.openPodModal(pod);
  }

  viewImage(service, microService) {
    this.systemModal.openImageModal(service, microService);
  }

  viewYaml(service) {
    this.systemModal.openYamlModal(service);
  }

  mergeServicePods(serviceName, microServicePods) {
    const selectedService = this.services.find(service => service.name === serviceName);
    selectedService.serviceInfos.map(microService => {
      const pods = [];
      microServicePods.map(servicePod => {
        if (servicePod.serviceName === microService.name) {
          pods.push(servicePod);
        }
      });
      microService.pods = pods;
    });
  }

  getTooltipText(service) {
    let tooltipText = this.translate.translateKey('SYSTEM.TOOLTIP.CANNOT_OPERATE_SERVICE');
    if (service.status === 'RUNNING') {
      tooltipText = this.translate.translateKey('SYSTEM.TOOLTIP.STOP_SERVICE');
    } else if (service.status === 'TERMINATED') {
      tooltipText = this.translate.translateKey('SYSTEM.TOOLTIP.START_SERVICE');
    }

    return tooltipText;
  }

  paginationChange() {
    this.getServiceList().subscribe();
  }

  openEditModal(size = 'md') {
    return this.tuiModal.open(EditComponent, {
      title: this.translate.translateKey('SYSTEM.EDIT_CONFIG'),
      size,
      data: {
      }
    }).subscribe((argu: string) => {});
  }

}
