import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TecApiService } from '../shared';
import { TranslateService } from '../i18n';

import * as models from './abstract.model';

@Injectable()
export class AbstractService {

  config = {
    fullResponse: true,
  };

  constructor(
    private api: TecApiService,
    private translateService: TranslateService,
  ) { }

  getSelectOptions(type?: string) {
    let result: models.TimeOption[] = [];
    const len: number = (type === 'hour' ? 24 : 12);  // 12 months
    const translate = this.translateService.translateKey;

    for (let i = len; i > 0; i--) {
      const str: string = i === 1 ?
        ( i + ' ' + (type === 'hour' ? this.translateService.translateKey('ABSTRACT.HOUR')
                      : this.translateService.translateKey('ABSTRACT.MONTH')))
        : (i + ' ' + (type === 'hour' ? this.translateService.translateKey('ABSTRACT.HOURS')
                    : this.translateService.translateKey('ABSTRACT.MONTHS')));
      result = [{
        label: this.translateService.translateKey('ABSTRACT.LAST') + ' ' + str,
        value: i,
      }].concat(result);
    }

    return result;
  }

  // 1.云平台概览：
  getQuantitySummary(): Observable<any> {
    return this.api.get(`platforms/count/summaries`, this.config);
  }

  // 2.平台概览
  getLoadSummary(callback, hour?: number) {
    this.api.get(`platforms/loads/summaries`, {recentHour: hour}).subscribe(response => {
      callback(this.adaptLoadSummary(response));
    });
  }

  adaptLoadSummary(quantitySummary) {
    const obj = {...quantitySummary};
    const result: models.Donut[] = [];

    delete obj.startTime;
    delete obj.endTime;

    Object.keys(obj).forEach(key => {

      const parts: number[] = [];
      const columns: string[] = [];

      obj[key].forEach(part => {
        parts.push(part.value);
        columns.push(part.title);
      });

      result.push({
        state: key,
        columns: columns,
        parts: parts,
      });

    });
    return {
      donuts: result,
    };
  }

  // 3.租户增长趋势
  getTenantCountTrend(callback, month?: number) {
    return this.api.get(`tenants/counts/trend`, {recentMonth: month}).subscribe(response => {
      callback(this.adaptToSingleLineData(response));
    });
  }

  adaptToSingleLineData(data) {
    const arr: models.LinePoint[] = [];
    let result: models.LineChartData[] ;

    data.counts.forEach(item => {
      arr.push({
        x: new Date(item.time),  // .slice(0, 10),
        y: item.count,
      });
    });

    return result = [{
      data: arr,
      topic: '',
    }];
  }

  // 4.云产品实例变化趋势
  getNodesLoadTrend(callback, hour?: number) {
    return this.api.get(`nodes/loads/trend`, {recentHour: hour}).subscribe(response => {
      callback(this.adaptToMultipleCurveData(response));
    });
  }

  adaptToMultipleCurveData(data) {
    const load = {...data.loads[0]};
    delete load.time;
    const keys = Object.keys(load);
    const resultObj = {};

    keys.forEach(key => {
      resultObj[key] = {
        data: [],
        topic: key,
      };
    });

    let d: string;
    data.loads.forEach(item => {
      d = new Date(item.time).toISOString();
      keys.forEach(key => {
        resultObj[key]['data'].push({
          x: d,
          y: item[key],
        });
      });
    });

    const result: models.MultipleCurveData[] = [];
    keys.forEach(key => result.push(resultObj[key]));

    return result;
  }

  // 5.主机变化趋势：
  getNodesCountTrend(callback, month?: number) {
    return this.api.get(`nodes/count/trend`, {recentMonth: month}).subscribe(response => {
      callback(this.adaptToSingleLineData(response));
    });
  }

  // 6.云产品实例排行：
  getInstancesTemplatesCountRank(callback, month?: number) {
    return this.api.get(`instances/templates/count/rank`, {recentMonth: month}).subscribe(response => {
      callback(this.adaptInstancesTemplatesCountData(response));
    });
  }

  adaptInstancesTemplatesCountData(data) {
    const counts = [...data.counts];
    const templateCounts = [...data.counts[0].templateCounts];
    const xs: string[] = [];
    const topics: string[] = [];
    templateCounts.forEach(obj => topics.push(obj.type));

    const series: any[] = [];
    const resultObj = { };
    topics.forEach(topic => resultObj[topic] = {
      topic: topic,
      data: [],
    });

    counts.forEach(item => {
      xs.push(item.productName);

      item['templateCounts'].forEach(templateCount => {
        resultObj[templateCount.type].data.push(templateCount.count);
        // series.push(templateCount.)
      });
    });

    topics.forEach(topic => series.push(resultObj[topic]));

    const result: models.InstancesTemplatesCount = {
      xs: xs,
      series: series,
      totalCount: data.totalCount,
    };

    return result;
  }

  // 7.实例总量变化趋势：
  getInstancesCountTrend(callback, month?: number) {
    return this.api.get(`instances/count/trend`, {recentMonth: month}).subscribe(response => {
      callback(this.adaptToSingleLineData(response));
    });
  }

  // 8.云产品实例变化趋势
  getProductInstancesCountTrend(callback, month?: number) {
    return this.api.get(`instances/products/count/trend`, {recentMonth: month}).subscribe(response => {
      callback(this.adaptToMultipleBrokenLineData(response));
    });
  }

  adaptToMultipleBrokenLineData(data) {
    const result: models.MultipleBrokenLine[] = [];

    data.forEach(item => {

      const heap: any[] = [];
      let fullDate: string;

      item.counts.forEach(count => {
        fullDate = new Date(count.time).toISOString();
        heap.push({
          x: fullDate,
          y: count.count,
        });
      });

      result.push({
        data: heap,
        topic: item.productName,
      });
    });

    return result;
  }

  // 9.租户消费top7
  getTenantsConsumptionsRank(callback, month?: number) {
    return this.api.get(`tenants/consumptions/rank`, {recentMonth: month}).subscribe(response => {
      callback(this.adaptTenantsConsumptionData(response));  // XXXXX
    });
  }

  adaptTenantsConsumptionData(data) {
    const xs: any[] = [];
    const consumptions = [...data.consumptions];

    const dt: any[] = [];

    consumptions.forEach(consumption => {
      xs.push(consumption.tenantName);
      dt.push(consumption.totalAmount);
    });

    const result: models.TenantsConsumption = {
      xs: xs,
      series: [{
        topic: '',
        data: dt,
      }],
    };

    return result;
  }

}
