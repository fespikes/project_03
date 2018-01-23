import { Component, OnInit, HostBinding } from '@angular/core';

import { Pagination, TuiModalService } from 'tdc-ui';
import { Instance, InstanceList } from './model/system-model';
import { SystemService } from './service/system.service';
import { TranslateService } from '../i18n';
import { SystemModalService } from './modal/system.modal.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'tec-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.sass'],
})
export class SystemComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  loading;
  keyword = '';
  labels = [];
  selectedLabel = undefined;
  filter = {
    serviceName: '',
    tag: '',
  };


  instances: Instance[];

  pagination = new Pagination();

  constructor(
    private system: SystemService,
    private translate: TranslateService,
    private tuiModal: TuiModalService,
    private systemModal: SystemModalService,
  ) { }

  ngOnInit() {
    this.getInstanceLabels().subscribe();
    this.getInstanceList().subscribe();
  }

  getInstanceList() {
    this.loading = true;
    return this.system.getInstanceList(this.filter, this.pagination)
      .map(result => {
        this.instances = result.data;
        this.pagination = result.pagination;
        this.loading = false;
      },
    );
  }

  getInstanceLabels() {
    this.loading = true;
    return this.system.getInstanceLabels()
      .map(result => {
        this.labels = result.map(label => {
          return {
            value: label,
            label: label,
          };
        });
      },
    );
  }

  filterChange() {
    this.filter = {
      serviceName: this.keyword,
      tag: this.selectedLabel,
    };
    this.getInstanceList().subscribe();
  }

  startInstance(instance) {
    instance.status = 'LOADING';
    this.system.startInstance(instance.name)
    .subscribe(() => {
      this.getInstanceList().subscribe();
    }, (error) => {
      this.tuiModal.apiError(error);
    });
  }

  stopInstance(instance) {
    instance.status = 'LOADING';
    this.system.stopInstance(instance.name)
    .subscribe(() => {
      this.getInstanceList().subscribe();
    }, (error) => {
      this.tuiModal.apiError(error);
    });
  }

  getInstancePods(instanceName) {
    this.loading = true;
    this.system.getInstancePods(instanceName)
    .subscribe((result) => {
      this.mergeServicePods(instanceName, result);
      this.loading = false;
    });
  }

  toggleSubList(instance) {
    instance.showSubList = !instance.showSubList;
    this.getInstancePods(instance.name);
  }

  viewPod(pod) {
    this.systemModal.openPodModal(pod);
  }

  viewImage(instance, service) {
    this.systemModal.openImageModal(instance, service);
  }

  viewYaml(instance) {
    this.systemModal.openYamlModal(instance);
  }

  mergeServicePods(instanceName, servicePods) {
    const selectedInstance = this.instances.find(instance => instance.name === instanceName);
    selectedInstance.serviceInfos.map(service => {
      const pods = [];
      servicePods.map(servicePod => {
        if (servicePod.serviceName === service.name) {
          pods.push(servicePod);
        }
      });
      service.pods = pods;
    });
  }

  paginationChange() {
    this.getInstanceList().subscribe();
  }

}
