import { Pagination } from 'tdc-ui';

export class Service {
  edition: string;
  image: string;
  labels: string[];
  name: string;
  serviceStatus: {
    available: number,
    disired: number,
    status: string,
  };
  survival: number;
}

export class ServiceList {
  data: Service[];
  pagination: Pagination;
}

export class Tag {
  name: string;
  width: number;
}
