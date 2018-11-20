import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '../../../i18n';

import {
  TecApiService, TimeOption,
  Donut, LinePoint, LineChartData,
  MultipleCurveData, InstancesTemplatesCount,
  MultipleBrokenLine, TenantsConsumption,
} from '../../../shared';

@Injectable()
export class TenantAbstractService {

  constructor(
    private api: TecApiService,
    private translateService: TranslateService,
  ) { }

  getWithUID(...params) {
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    return this.api.get(`tenants/${uid}/` + params[0], {...params[1]});
  }

  // 1.平台概览
  fetchPlatformSummary(callback) {
    return this.getWithUID(`overviews`).subscribe(response => {
      callback(this.adaptDonutChartData(response));
    });
  }

  adaptDonutChartData(data) {
    const obj = {...data};
    const result: Donut[] = [];
    const alias: any = {};

    delete obj.time;
    delete obj.uid;

    /**
    the keys must belongs to :
    [
      HEALTHPERCENT        租户健康度
      TICKETPERCENT        工单处理率
      ARREARSPERCENT        租户欠费率
    ] */

    Object.keys(obj).forEach(key => {
      alias[key] = this.translateService.translateKey('TENANT.ABSTRACT.' + key.toUpperCase());

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

  // 2.消费概况
  fetchConsumptionSummary(callback) {
    return this.getWithUID(`consumptions/summaries`).subscribe(response => {
      callback(response);
    });
  }

  // 3.云产品实例变化趋势  line chart
  fetchInstancesCountTrend(callback, month?: number) {
    return this.getWithUID(`instances/count/trend`, {recentMonth: month}).subscribe(response => {
      callback(this.adaptLineChartData(response, 'counts'));
    });
  }

  adaptLineChartData(data, type) {
    const arr: LinePoint[] = [];
    let result: LineChartData[] ;

    data[type].forEach(item => {
      arr.push({
        x: new Date(item.time),  // .slice(0, 10),
        y: (type === 'consumptions' ? item.totalAmount : item.count),
      });
    });

    return result = [{
      data: arr,
      topic: '',
    }];
  }

  // 4.消费变化趋势
  fetchConsumptionsTrend(callback, month?: number) {
    return this.getWithUID(`consumptions/trend`, {recentMonth: month}).subscribe(response => {
      callback(this.adaptLineChartData(response, 'consumptions'));
    });
  }

  // 5.云产品实例数量
  fetchInstancesCount(callback) {
    return this.getWithUID(`instances/templates/count`).subscribe(response => {
      callback(this.adaptInstanceCountData(response));
    });
  }

  adaptInstanceCountData(data) {
    const counts = [...data];
    const templateCounts = [...data[0].templateCounts];
    const xs: string[] = [];
    const topics: string[] = [];
    const topicObj: object = {};
    templateCounts.forEach(obj => {
      topics.push(obj.type);
      topicObj[obj.type] = obj.typeAlias;
    });

    const series: any[] = [];
    const resultObj = { };
    topics.forEach(topic => resultObj[topic] = {
      topic: topicObj[topic],
      data: [],
    });

    counts.forEach(item => {
      xs.push(item.productNameAlias);

      item['templateCounts'].forEach(templateCount => {
        resultObj[templateCount.type].data.push(templateCount.count);
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
  // 6.CPU 负载率; 7.内存使用量; 8.磁盘使用量
  fetchResourcesTrend(callback, resourceType: string = 'CPU') {
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    return this.getWithUID(`resources/trend`, {name: resourceType}).subscribe(response => {
      callback(this.adaptResourcesTrendData(response));
    });
  }

  adaptResourcesTrendData(data) {
    const result: any[] = [];
    const keys = ['limits', 'requests', 'usages'];
    const keyObj = {};

    keys.forEach( key => {
      keyObj[key] = this.translateService.translateKey('TENANT.ABSTRACT.' + key.toUpperCase());

      const stack: any[] = [];
      data[key].forEach(dt => {
        stack.push({
          x: new Date(dt.time),
          y: dt.value,
        });
      });

      result.push({
        topic: keyObj[key],
        data: stack,
      });
    });

    return {
      result: result,
      unit: data.unit,
      lastHour: {
        avg: data.avg.toFixed(1),
        max: data.max.toFixed(1),
        min: data.min.toFixed(1),
        now: data.now.toFixed(1),
      },
    };
  }

  // TOTO: 9.网络使用量; 10.服务kill 情况
  // not implemented by backend till 0118
}
