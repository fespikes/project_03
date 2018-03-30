import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Pagination } from 'tdc-ui';
import { TecApiService } from '../../../services';
import {
  ServiceList,
  Service,
  ServiceYamls,
  ServiceFilter,
  ServiceImage,
} from '../model/system-model';
import { inspect } from 'util';

@Injectable()
export class SystemService {

  constructor(
    private api: TecApiService,
  ) { }

  getServiceLabels(uid = null) {
    return this.api.get(`services/labels`, !uid ? {} : {uid: uid});
  }

  getServicePods(serviceName: string, uid = null) {
    return this.api.get(`services/${serviceName}/pods`, !uid ? {} : {uid: uid});
  }

  getServiceYamls(serviceName: string, uid = null): Observable<ServiceYamls> {
    return this.api.get(`services/${serviceName}/yamls`, !uid ? {} : {uid: uid});
  }

  getServiceImages(serviceName, microServiceName, uid = null) {
    return this.api.get(`services/${serviceName}/subServices/${microServiceName}/images`, !uid ? {} : {uid: uid});
  }

  updateServiceImage(image: ServiceImage, uid = null) {
    const body = {
      baseImage: image.newBaseImage && image.newBaseImage.trim() ? image.newBaseImage : image.baseImage,
      initImage: image.newInitImage && image.newInitImage.trim() ? image.newInitImage : image.initImage,
    };
    const url = !uid ? `services/${image.serviceName}/subServices/${image.microServiceName}/images`
      : `services/${image.serviceName}/subServices/${image.microServiceName}/images?uid=${uid}`;
    return this.api.put(url, body);
  }

  startService(serviceName: string, uid = null) {
    const url = !uid ? `services/${serviceName}/restart` : `services/${serviceName}/restart?uid=${uid}`;
    return this.api.post(url);
  }

  stopService(serviceName: string, uid = null) {
    const url = !uid ? `services/${serviceName}/stop` : `services/${serviceName}/stop?uid=${uid}`;
    return this.api.post(url);
  }

  getPodEvents(podName: string, uid = null) {
    return this.api.get(`services/pods/${podName}/events`, !uid ? {} : {uid: uid});
  }

  getPodLogs(podName: string, uid = null) {
    return this.api.get(`services/pods/${podName}/logs`, !uid ? {} : {uid: uid});
  }

}
