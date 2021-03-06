import { LinePoint, LineChartData } from '../chart/lib';

export { LineChartData } from '../chart/lib';

export interface Pagination {
  page: number;
  size: number;
  total: number;
}

export interface PartialCollection {
  data: any[];
  pagination: Pagination;
}

export class TimeOption {
  label: string;
  value: number;
}

export const chartTypes = {
  donut: 'donut',
  line: 'line',
  bar: 'bar',
};

export { DonutChartData, Donut } from '../chart/lib';
export { LinePoint };

export class MultipleCurveData {
  data: LinePoint[];
  topic: string;
}

export class InstancesTemplatesCount {
  xs: string[];
  series: any[];
  totalCount: number;
}

export class MultipleBrokenLine {
  data: LinePoint[];
  topic: string;
}

export class TenantsConsumption {
  xs: string[];

  series: {
    topic: string;
    data: number[],
  }[];
}

export const resourceTypes = {
  cpu: 'CPU',
  storage: 'STORAGE',
  memory: 'MEMORY',
};

export class Task {
  id: string;
  applyTenant: string;
  applyUser: string;
  creator: string;
  description: string;
  link: string;
  status: string;
  statusAlias: string;
  type: string;
  typeAlias: string;
  updateTime: string;
}
