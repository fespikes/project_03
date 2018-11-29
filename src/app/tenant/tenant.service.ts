import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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


@Injectable()
export class TenantService {

  constructor(private api: TecApiService) { }

  public get uid(): string {
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    return uid;
  }

  public get networks() {
    const networks = sessionStorage.getItem('eco:tenant:detail:networks');
    return networks;
  }

  public get networkName() {
    const networkName = sessionStorage.getItem('eco:tenant:detail:networkName');
    return networkName;
  }

  fetchAllTenants(filter = {}): Observable<TenantInfo[]> {
    return this.api.get('tenants', filter);
  }

  fetchSummaries(filter: TenantFilter): Observable<TenantSummaries> {
    return this.api.get(`tenants/summaries`, {...filter});
  }

  fetchTenantsCount(filter = {}): Observable<TenantCount> {
    return this.api.get(`tenants/count`, filter);
  }

  fetchConsumption(period: string): Observable<Consumption[]> {
    return this.api.get(`tenants/consumptions`, {period: period});
  }

  fetchInfo(uid: string): Observable<TenantInfo> {
    sessionStorage.setItem('eco:tenant:detail:uid', uid);
    return this.api.get(`tenants/${uid}`);
  }

  fetchInstanceInfos(uid, pagination, filter): Observable<InstanceInfo> {
    const { page, size } = pagination;
    const params = {
      page: page,
      size: size,
      ...filter,
    };
    return this.api.get(`tenants/${uid}/instances`, params);
  }

  fetchErrors(name, filter): Observable<Errors> {
    return this.api.get(`tenant/${name}/errors`, filter);
  }

  fetchQuotas(): Observable<any> {
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    return this.api.get(`tenants/${uid}/quotas`);
  }

  putQuotas(body: Object): Observable<any> {
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    return this.api.put(`tenants/${uid}/quotas`, {...body});
  }

  fetchBills(uid, pagination, keyword): Observable<Bills> {
    const { page, size } = pagination;
    const params = {
      page: page,
      size: size,
      keyword: keyword,
    };
    return this.api.get(`tenants/${uid}/bills`, params);
  }

  clearBill(id): Observable<OperationResult> {
    return this.api.put(`bills/${id}`);
  }

  correctBill(id, corrections): Observable<OperationResult> {
    return this.api.post(`bills/${id}/corrections`, corrections);
  }

  // 网络管理: get tenant network list
  getNetworks(): Observable<any> {
    const uid = sessionStorage.getItem('eco:tenant:detail:uid');
    return this.api.get(`tenants/${uid}/networks`);
  }

  // 网络规则:
  getSecurityRules(networkRulesFilter: NetworkRules): Observable<any> {
    const filter = {...networkRulesFilter};
    sessionStorage.setItem('eco:tenant:detail:networkName', filter.networkName);

    delete filter.networkName;
    return this.api.get(`networks/${networkRulesFilter.networkName}/securityRules`, filter);
  }

  // 新增网络规则
  addSecurityRule(networkName: string, body: any): Observable<any> {
    return this.api.post(`networks/${networkName}/securityRules`, {...body});
  }

  // 删除网络
  // deleteNetwork(networkName: string): Observable<any> {
  //   return this.api.delete(`networks/${networkName}`);
  // }

  // 删除网络规则
  deleteSecurityRule(networkName: string, body: any): Observable<any> {
    return this.api.post(`networks/${networkName}/securityRules/deletions`, body);
  }

  deleteTenant(body): Observable<any> {
    return this.api.post(`tenants/cancel`, body);
  }

  getTenantServices(id, pagination = {}, filter = {}): Observable<ServiceList> {
    const params = Object.assign(pagination, filter);
    return this.api.get(`tenants/${id}/services`, params);
  }

  // 查看ignitor用户
  getTenantAdmins(filter: TenantAdminFilter): Observable<any> {
    return this.api.get(`managers`, {...filter});
  }

  // 创建ignitor用户
  addTenantAdmin(manager: TenantAdmin): Observable<any> {
    return this.api.post(`managers`, {...manager});
  }

  // 通过连接邀请ignitor用户
  sendRegisterLink(invitation: any): Observable<any> {
    return this.api.post(`managers/invitations`, {...invitation});
  }

  putQuantity(username, quantity) {
    return this.api.put(`managers/${username}/quantities`, {quantity: quantity});
  }

  deleteTenantAdmin(name: string): Observable<any> {
    return this.api.delete(`managers/${name}`);
  }

}
