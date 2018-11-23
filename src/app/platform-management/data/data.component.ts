import { Component, OnInit, HostBinding } from '@angular/core';
import { map } from 'rxjs/operators';

import { Pagination, TuiModalService } from 'tdc-ui';
import { TranslateService } from 'app/i18n';

import {
  SystemService,
  SystemModalService,
  Service,
  ServiceFilter,
  ServiceList,
} from 'app/shared';
import { DataService } from './data.service';
import { ShareComponent } from './share/share.component';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'tec-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.sass']
})
export class DataComponent implements OnInit {
  loading = false;
  labels = [];
  services: Service[];
  filter = new ServiceFilter();
  pagination = new Pagination();

  constructor(
    private service: DataService,
    private systemService: SystemService,
    private systemModal: SystemModalService,
    private translate: TranslateService,
    private tuiModal: TuiModalService,
  ) { }
  // TODO: optimization of below code
  ngOnInit() {
    this.getServiceLabels().subscribe();
    this.getServiceList().subscribe();
  }

  getServiceList() {
    this.loading = true;
    return this.service.getServiceList(this.filter, this.pagination)
    .pipe(map(result => {
      this.services = result.data;
      this.pagination = result.pagination;
      this.loading = false;
    }));
  }

  getServiceLabels() {
    return this.systemService.getDataServiceLabels()
    .pipe(map(result => {
      this.labels = result;
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

  shareService(service, size = 'lg') {
    return this.tuiModal.open(ShareComponent, {
      title: this.translate.translateKey('SYSTEM.POPUP.SERVICE_SHARE'),
      size,
      data: {
        service: service
      }
    }).subscribe((argu: string) => {
      this.getServiceList().subscribe();
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
    this.systemModal.openImageModal(service, microService, (service.category || {}).uid);
  }

  viewYaml(service) {
    this.systemModal.openYamlModal(service, (service.category || {}).uid);
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
        from: 'data'
      }
    }).subscribe((argu: string) => {});
  }

}
