import { LinePoint } from '../chart/lib/line';
export { LineChartData } from '../chart/lib/line';
export { DonutChartData, Donut } from '../chart/lib/donut';
export { LinePoint };

export class TimeOption {

  label: string;

  value: number;

}

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
