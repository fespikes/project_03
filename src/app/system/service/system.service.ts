import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Pagination } from 'tdc-ui';
import { TecApiService } from '../../shared';
import {
  InstanceList,
  Instance,
  Yamls,
  Filter,
  Image,
} from '../model/system-model';
import { inspect } from 'util';

@Injectable()
export class SystemService {

  constructor(
    private api: TecApiService,
  ) { }

  getInstanceList(filter: Filter, pagination: Pagination) {
    const condition = Object.assign(filter, pagination);
    return this.api.get(`instances/list`, condition);
  }

  getInstanceLabels() {
    return this.api.get(`instances/list/labels`);
  }

  getInstancePods(instanceName: string) {
    return this.api.get(`instances/${instanceName}/list/pods`);
  }

  getInstanceYamls(instanceName: string): Observable<Yamls> {
    return this.api.get(`instances/${instanceName}/yamls`);
  }

  getImages(instanceName, serviceName) {
    return this.api.get(`instances/${instanceName}/images/`, {service: serviceName});
  }

  updateImage(image: Image) {
    const body = {
      baseImage: image.newBaseImage && image.newBaseImage.trim() ? image.newBaseImage : image.baseImage,
      initImage: image.newInitImage && image.newInitImage.trim() ? image.newInitImage : image.initImage,
      serviceName: image.serviceName,
    };
    return this.api.put(`instances/${image.instanceName}/images?service=${image.serviceName}`, body);
  }

  startInstance(instanceName: string) {
    return this.api.post(`instances/restart/${instanceName}`);
  }

  stopInstance(instanceName: string) {
    return this.api.post(`instances/stop/${instanceName}`);
  }

  getPodEvents(podName: string) {
    return this.api.get(`instances/${podName}/events`);
  }

  getPodLogs(podName: string) {
    return this.api.get(`instances/${podName}/logs`);
  }

}
