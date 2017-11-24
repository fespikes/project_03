import { Pagination } from 'tdc-ui';

export class TenantInfo {
  name = '';
  description = '';
  admin = '';
  created = '';
}

export class TenantSummary {
  name = '';
  description = '';
  admin = '';
  instances = 0;
  users = 0;
}

export class Consumption {
  name = '';
  sum = 0;
}

export class Instance {
  name = '';
  description = '';
  status = '';
  tcu = 0;
  templare = '';
  product = '';
}

export class Error {
  id = 0;
  level = '';
  component = '';
  type = '';
  status = '';
  description = '';
  created = '';
}

export class Errors {
  data: Error[];
  pagination: Pagination;
}

export class Quota {
  cpu = {
    limit: 0,
    unit: '',
  };
  memory = {
    limit: 0,
    unit: '',
  };
  storage = {
    limit: 0,
    unit: '',
  };
  network = {
    limit: 0,
    unit: '',
  };
}
