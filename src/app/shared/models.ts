import { LinePoint, LineChartData } from '../chart/lib/line';

export { LineChartData } from '../chart/lib/line';

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

export { DonutChartData, Donut } from '../chart/lib/donut';
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
