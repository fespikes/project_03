import { Pagination } from 'tdc-ui';

export class Service {
  edition: string;
  labels: string[];
  name: string;
  survival: number;
  serviceInfos: MicroService[];
}

export class MicroService {
  image: string;
  kind: string;
  name: string;
  namespace: string;
  survial: number;
  pods: any[];
  serviceStatus: {
    available: number;
    disired: number;
    status: string;
  };
}

export class ServiceList {
  data: Service[];
  pagination: Pagination;
}

export class ServiceFilter {
  service?: string;
  tag?: string;
  status?: string;

  constructor(service = '', tag = '', status = '') {
    this.service = service;
    this.tag = tag;
    this.status = status;
  }
}

export class ServiceYamls {
  apiVersion: string;
  kind: string;
  metadata: {
    annotations: Object;
    clusterName: string;
    creationTimestamp: string;
    deletionGracePeriodSeconds: number;
    deletionTimestamp: string;
    finalizers: string[];
    generateName: string;
    generation: number;
    labels: Object;
    name: string;
    namespace: string;
    ownerReferences: [
      {
        apiVersion: string;
        controller: boolean;
        kind: string;
        name: string;
        uid: string;
      }
    ];
    resourceVersion: string;
    selfLink: string;
    uid: string;
  };
  spec: {
    applicationRef: {
      name: string;
      version: string;
    };
    configs: string;
    dependencies: [
      {
        dependencyRef: {
          apiVersion: string;
          fieldPath: string;
          kind: string;
          name: string;
          namespace: string;
          resourceVersion: string;
          uid: string;
        },
        name: string;
      }
    ];
    instanceId: string;
  };
  status: {
    dependedBy: [
      {
        apiVersion: string;
        fieldPath: string;
        kind: string;
        name: string;
        namespace: string;
        resourceVersion: string;
        uid: string;
      }
    ];
    dependsOn: [
      {
        apiVersion: string;
        fieldPath: string;
        kind: string;
        name: string;
        namespace: string;
        resourceVersion: string;
        uid: string;
      }
    ];
    modules: [
      {
        ports: [
          {
            name: string;
            nodePort: number;
            ready: boolean;
          }
        ];
        ready: boolean;
        resourceRef: {
          apiVersion: string;
          fieldPath: string;
          kind: string;
          name: string;
          namespace: string;
          resourceVersion: string;
          uid: string;
        };
      }
    ];
    observedGeneration: number;
    phase: string;
    ready: boolean;
  };
}

export class ServiceTag {
  name: string;
  width: number;
}

export class ServicePod {
  containers: ServicePodContainer[];
  createTime: string;
  name: string;
  status: string;
}

export class ServicePodContainer {
  name: string;
  podName: string;
  status: string;
}

export class ServicePodEvent {
  count: number;
  firstTimestamp: string;
  lastTimestamp: string;
  message: string;
  reason: string;
  type: string;
}

export class ServicePodLog {
  logs: string;
  name: string;
  container_name: string;
}

export class ServiceImage {
  baseImage: string;
  initImage: string;
  newBaseImage: string;
  newInitImage: string;
  showChangeBaseImage: Boolean;
  showChangeInitImage: Boolean;
  serviceName: string;
  microServiceName: string;
}
