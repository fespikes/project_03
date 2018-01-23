import { Pagination } from 'tdc-ui';

export class Instance {
  edition: string;
  labels: string[];
  name: string;
  survival: number;
  serviceInfos: Service[];
}

export class Service {
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

export class InstanceList {
  data: Instance[];
  pagination: Pagination;
}

export class Filter {
  serviceName: string;
  tag: string;
}

export class Yamls {
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

export class Tag {
  name: string;
  width: number;
}

export class Pod {
  containers: PodContainer[];
  createTime: string;
  name: string;
  status: string;
}

export class PodContainer {
  name: string;
  podName: string;
  status: string;
}

export class PodEvent {
  count: number;
  firstTimestamp: string;
  lastTimestamp: string;
  message: string;
  reason: string;
  type: string;
}

export class PodLog {
  logs: string;
  name: string;
  container_name: string;
}

export class Image {
  baseImage: string;
  initImage: string;
  newBaseImage: string;
  newInitImage: string;
  showChangeBaseImage: Boolean;
  showChangeInitImage: Boolean;
  serviceName: string;
  instanceName: string;
}
