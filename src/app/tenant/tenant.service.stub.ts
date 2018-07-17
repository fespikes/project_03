import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { TenantService } from './tenant.service';
import { Injectable } from '@angular/core';

import { TecApiService, ServiceList } from '../shared';
import { TenantFilter, Instance, TenantAdminFilter, TenantAdmin } from './tenant-model';
import { Pagination } from 'tdc-ui';
import {
  TenantInfo,
  TenantSummary,
  TenantSummaries,
  TenantCount,
  Consumption,
  InstanceInfo,
  Errors,
  Quota,
  Bills,
  OperationResult,
  NetworkRules,
} from './tenant-model';

const commonRes = {
  data: [],
  pagination: {},
};

export default class TenantServiceStub {
  fetchAllTenants(filter = {}): Observable<TenantInfo[]> {
    return of([] as TenantInfo[]);
  }

  fetchSummaries() {
    return of({...commonRes});
  }

  fetchTenantsCount(filter = {}): Observable<TenantCount> {
    return of({} as TenantCount);
  }

  fetchConsumption(period: string): Observable<Consumption[]> {
    return of([] as Consumption[]);
  }

  fetchInfo(uid: string): Observable<TenantInfo> {
    return of({} as TenantInfo);
  }

  fetchInstanceInfos(uid, pagination, filter): Observable<InstanceInfo> {
    return of({} as InstanceInfo);
  }

  fetchErrors(name, filter) {
    return of({...commonRes});
  }

  fetchQuotas(): Observable<any> {
    return of({...commonRes});
  }

  putQuotas(body: Object): Observable<any> {
    return of({...commonRes});
  }

  fetchBills(uid, pagination, keyword): Observable<Bills> {
    return of({...commonRes} as Bills);
  }

  clearBill(id): Observable<OperationResult> {
    return of({} as OperationResult);
  }

  correctBill(id, corrections): Observable<OperationResult> {
    return of({} as OperationResult);
  }

  // 网络管理: get tenant network list
  getNetworks(): Observable<any> {
    return of({});
  }

  // 网络规则:
  getSecurityRules(networkRulesFilter: NetworkRules): Observable<any> {
    return of({});
  }

  // 新增网络规则
  addSecurityRule(networkName: string, body: any): Observable<any> {
    return of({});
  }

  // 删除网络
  deleteNetwork(networkName: string): Observable<any> {
    return of({});
  }

  // 删除网络规则
  deleteSecurityRule(networkName: string, body: any): Observable<any> {
    return of({});
  }

  deleteTenant(body): Observable<any> {
    return of({});
  }

  getTenantServices(id, pagination = {}, filter = {}): Observable<ServiceList> {
    return of({...commonRes} as ServiceList);
  }

  // 查看ignitor用户
  getTenantAdmins(filter: TenantAdminFilter): Observable<any> {
    return of({...commonRes});
  }

  // 创建ignitor用户
  addTenantAdmin(manager: TenantAdmin): Observable<any> {
    return of({});
  }

  // 通过连接邀请ignitor用户
  sendRegisterLink(invitation: any): Observable<any> {
    return of({});
  }

}
