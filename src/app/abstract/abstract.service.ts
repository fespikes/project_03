import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TecApiService } from '../shared';


@Injectable()
export class AbstractService {

  config = {
    fullResponse: true,
  };

  constructor(
    private api: TecApiService,
  ) { }

  // 1.云平台概览：
  getQuantitySummary(): Observable<any> {
    return this.api.get(`platforms/count/summaries`, this.config);
  }

  // 2.平台概览
  getLoadSummary(callback) {
    this.api.get(`platforms/loads/summaries`, this.config).subscribe(response => {
      callback(this.adaptLoadSummary(response));
    });
  }

  adaptLoadSummary(quantitySummary) {
    const obj = {...quantitySummary};
    const result = [];

    delete obj.startTime;
    delete obj.endTime;

    Object.keys(obj).forEach(key => {

      const parts = [];
      const columns = [];

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
  getTenantCountTrend(callback) {
    return this.api.get(`tenants/counts/trend`, this.config).subscribe(response => {
      callback(this.adaptToSingleLineData(response));
    });
  }

  adaptToSingleLineData(data) {
    const arr = [];
    let result: any ;

    data.counts.forEach(item => {
      arr.push({
        x: new Date(item.time).toISOString(),  // .slice(0, 10),
        y: item.count,
      });
    });

    return result = [{
      data: arr,
      topic: '',
    }];
  }

  // 4.云产品实例变化趋势
  getNodesLoadTrend(callback) {
    return this.api.get(`nodes/loads/trend`, this.config).subscribe(response => {
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

    const result: any[] = [];
    keys.forEach(key => result.push(resultObj[key]));

    return result;
  }

  // 5.主机变化趋势：
  getNodesCountTrend(callback) {
    return this.api.get(`nodes/count/trend`, this.config).subscribe(response => {
      callback(this.adaptToSingleLineData(response));
    });
  }

  // 6.云产品实例排行：
  getInstancesTemplatesCountRank(callback) {
    return this.api.get(`instances/templates/count/rank`, this.config).subscribe(response => {
      callback(this.adaptInstancesTemplatesCountData(response));
    });
  }

  adaptInstancesTemplatesCountData(data) {
    const counts = [...data.counts];
    const templateCounts = [...data.counts[0].templateCounts];
    const xs: any[] = [];
    const topics: any[] = [];
    templateCounts.forEach(obj => topics.push(obj.type));

    const series: any[] = [];
    const resultObj = {

    };
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

    const result = {
      xs: xs,
      series: series,
    };

    return result;
  }

  // 7.实例总量变化趋势：
  getInstancesCountTrend(callback) {
    return this.api.get(`instances/count/trend`, this.config).subscribe(response => {
      callback(this.adaptToSingleLineData(response));
    });
  }

  // 8.云产品实例变化趋势
  getProductInstancesCountTrend(callback) {
    return this.api.get(`instances/products/count/trend`, this.config).subscribe(response => {
      callback(this.adaptToMultipleBrokenLineData(response));
    });
  }

  adaptToMultipleBrokenLineData(data) {
    const result: any[] = [];

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
  getTenantsConsumptionsRank(callback) {
    return this.api.get(`tenants/consumptions/rank`, this.config).subscribe(response => {
      callback(this.adaptTenantsConsumptionData(response));  // XXXXX
    });
  }

  adaptTenantsConsumptionData(data) {
    // TODO: adapt the changed api data;
    const result = { };

    return result;
  }

}
