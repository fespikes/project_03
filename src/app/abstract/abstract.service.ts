import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TranslateService } from '../i18n';
import {
  TecApiService,
  Donut, LinePoint, LineChartData,
  MultipleCurveData, InstancesTemplatesCount,
  MultipleBrokenLine, TenantsConsumption,
} from '../shared';

@Injectable()
export class AbstractService {

  config = {
    fullResponse: true,
  };

  constructor(
    private api: TecApiService,
    private translateService: TranslateService,
  ) {
    this.getFeatures();
  }

  getFeatures() {
    // S: mock
    // const mock = {'user': { 'emailEnabled': false, 'phoneEnabled': true}};
    // const toggles = JSON.stringify(mock);
    // window.localStorage.setItem('eco:features', toggles);
    // E: mock
     this.api.get(`features`, {flattened: false}).subscribe(res => {
      const toggles = JSON.stringify(res);
      window.localStorage.setItem('eco:features', toggles);
    });
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
    const result: Donut[] = [];
    const alias: any = obj.alias;

    delete obj.startTime;
    delete obj.endTime;
    delete obj.alias;

    Object.keys(obj).forEach(key => {

      const parts: number[] = [];
      const columns: string[] = [];

      if (obj[key] === null) {
        return ;
      }

      obj[key].forEach(part => {
        parts.push(part.value);
        columns.push(part.title);
      });

      result.push({
        state: alias[key],    // translated key from backend
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
    const arr: LinePoint[] = [];
    let result: LineChartData[] ;

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

  // 4.主机负载情况
  getNodesLoadTrend(callback, hour?: number) {
    return this.api.get(`nodes/loads/trend`, {recentHour: hour}).subscribe(response => {
      callback(this.adaptToMultipleCurveData(response));
    });
  }

  adaptToMultipleCurveData(data) {
    const load = {...data.loads[0]};
    const alias: any = data.alias;
    delete load.time;
    delete data.alias;
    const keys = Object.keys(load);
    const resultObj = {};

    keys.forEach(key => {
      resultObj[key] = {
        data: [],
        topic: alias[key],
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

    const result: MultipleCurveData[] = [];
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
    templateCounts.forEach(obj => topics.push(obj.typeAlias));

    const series: any[] = [];
    const resultObj = { };
    topics.forEach(topic => resultObj[topic] = {
      topic: topic,
      data: [],
    });

    counts.forEach(item => {
      xs.push(item.productNameAlias);

      item['templateCounts'].forEach(templateCount => {
        resultObj[templateCount.typeAlias].data.push(templateCount.count);
        // series.push(templateCount.)
      });
    });

    topics.forEach(topic => series.push(resultObj[topic]));

    const result: InstancesTemplatesCount = {
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
    const result: MultipleBrokenLine[] = [];

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
        topic: item.productNameAlias,
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

    const result: TenantsConsumption = {
      xs: xs,
      series: [{
        topic: '',
        data: dt,
      }],
    };

    return result;
  }

}
