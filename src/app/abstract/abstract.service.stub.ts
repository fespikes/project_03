import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { TimeOption } from '../shared';

export class AbstractServiceStub {

  getSelectOptions(type?: string) {
    const result: TimeOption[] = [];
    return result;
  }

  // 1.云平台概览：
  getQuantitySummary(): Observable<any> {
    return of({});
  }

  // 2.平台概览
  getLoadSummary(callback, hour?: number) {
    of({
      donuts: [],
    }).subscribe(response => callback(response));
  }

  // 3.租户增长趋势
  getTenantCountTrend(callback, month?: number) {
    of([{
      data: [],
      topic: '',
    }]).subscribe(response => callback(response));
  }

  // 4.云产品实例变化趋势
  getNodesLoadTrend(callback, hour?: number) {
    of([]).subscribe(response => callback(response));
  }

  // 5.主机变化趋势：
  getNodesCountTrend(callback, month?: number) {
    of([{
      data: [],
      topic: '',
    }]).subscribe(response => callback(response));
  }

  // 6.云产品实例排行：
  getInstancesTemplatesCountRank(callback, month?: number) {
    of({
      xs: [],
      series: [],
    }).subscribe(response => callback(response));
  }

  // 7.实例总量变化趋势：
  getInstancesCountTrend(callback, month?: number) {
    of([{
      data: [],
      topic: '',
    }]).subscribe(response => callback(response));
  }

  // 8.云产品实例变化趋势
  getProductInstancesCountTrend(callback, month?: number) {
    of([{
      data: [],
      topic: '',
    }]).subscribe(response => callback(response));
  }

  // 9.租户消费top7
  getTenantsConsumptionsRank(callback, month?: number) {
    of({
      xs: [],
      series: [{
        // topic: '',
        data: [],
      }],
    }).subscribe(response => callback(response));
  }
}
