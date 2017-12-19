import { Pagination } from 'tdc-ui';

export class TenantInfo {
  name = '';
  description = '';
  admin = '';
  createTime = '';
  status = '';
  uid = '';
}

export class AllTenants {
  data: TenantInfo[];
}

export class TenantInfoWrap {
  data: TenantInfo;
}

export class TenantSummary {
  billMonth = '';
  unpaid = 0;
  instanceCount = 0;
  userCount = 0;
  consumption = 0;
  tenantInfo: TenantInfo;
}

export class TenantSummaries {
  data: {
    data: TenantSummary[],
    pagination: Pagination,
  };
}

export class TenantCount {
  data: {
    count: 0,
    time: 0,
  };
}

export class Consumption {
  name = '';
  sum = 0;
}

export class InstanceInfo {
  data: {
    data: Instance[],
    pagination: Pagination,
  };
}

export class Instance {
  name = '';
  description = '';
  status = '';
  tcuCount = 0;
  templateName = '';
}

export class Error {
  id = 0;
  level = '';
  component = '';
  type = '';
  status = '';
  description = '';
  time = '';
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

export class Bills {
  data: {
    data: {
      id: string,
      chargeAmount: number,
      correctAmount: number,
      time: number,
      totalAmount: number,
      status: string,
      tenantUid: string,
    }[],
    pagination: Pagination,
  };
}

export class Bill {
  id: string;
  chargeAmount: number;
  correctAmount: number;
  time: number;
  totalAmount: number;
  status: string;
  tenantUid: string;
}

export class OperationResult {
  messgae: string;
  resultCode: string;
  data: {};
}
