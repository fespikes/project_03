import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

import { Pagination, TuiModalService } from 'tdc-ui';
import { TranslateService } from 'app/i18n';
import { TenantService } from '../../tenant.service';
import {
  Service,
  ServiceFilter,
  SystemService,
  SystemModalService,
  TecUtilService
} from 'app/shared';


@Component({
  selector: 'tec-tenant-service',
  templateUrl: './tenant-service.component.html',
  styleUrls: ['./tenant-service.component.sass'],
})
export class TenantServiceComponent implements OnInit {

  loading;
  isAdmin = false;
  services: Service[];
  labels = [];
  uid: number;
  filter = new ServiceFilter();
  pagination = new Pagination();

  constructor(
    private modalService: SystemModalService,
    private route: ActivatedRoute,
    private systemService: SystemService,
    private tuiModalService: TuiModalService,
    private tenantService: TenantService,
    private translate: TranslateService,
    private utilService: TecUtilService
  ) {}

  ngOnInit() {
    this.isAdmin = this.utilService.checkIsAdmin();
    this.route.params
    .subscribe((params) => {
      this.uid = params['uid'];
      this.getTenantServices();
      this.getTenantLables();
    });
  }

  getTenantServices() {
    this.tenantService.getTenantServices(this.uid, this.pagination, this.filter)
    .subscribe((result) => {
      this.services = result.data;
      this.pagination = result.pagination;
    });
  }

  getTenantLables() {
    this.systemService.getServiceLabels(this.uid)
    .subscribe((result) => {
      this.labels = result.map(label => {
        return {
          value: label,
          label: label,
        };
      });
    });
  }

  filterChange() {
    this.pagination.page = 1;
    this.getTenantServices();
  }

  startService(service) {
    this.systemService.startService(service.name, this.uid)
    .subscribe(() => {
      this.getTenantServices();
    });
  }

  stopService(service) {
    this.systemService.stopService(service.name, this.uid)
    .subscribe(() => {
      this.getTenantServices();
    });
  }

  getServicePods(serviceName) {
    this.loading = true;
    this.systemService.getServicePods(serviceName, this.uid)
    .subscribe((result) => {
      this.mergeServicePods(serviceName, result);
      this.loading = false;
    });
  }

  toggleSubList(service) {
    service.showSubList = !service.showSubList;
    this.getServicePods(service.name);
  }

  viewPod(pod) {
    this.modalService.openPodModal(pod, this.uid);
  }

  viewImage(service, microService) {
    this.modalService.openImageModal(service, microService, this.uid);
  }

  viewYaml(service) {
    this.modalService.openYamlModal(service, this.uid);
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

  paginationChange() {
    this.getTenantServices();
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

}
