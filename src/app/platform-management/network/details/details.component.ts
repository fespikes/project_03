import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from 'app/i18n';
import { Pagination, TuiModalService, TuiMessageService } from 'tdc-ui';
import { XNetwork, XSecurityRule } from '../network.model';
import { NetworkService } from '../network.service';
import { AddComponent } from 'app/shared';

@Component({
  selector: 'tec-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass']
})
export class DetailsComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;
  backUrl = '/management/list';
  submenuItems = [];
  networks: Array<XNetwork>;
  amount = 0;
  loading = false;
  name: string;
  filter: string;
  rules: XSecurityRule[];
  pagination: Pagination = new Pagination();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: NetworkService,
    private translateService: TranslateService,
    private modal: TuiModalService,
    private message: TuiMessageService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((paramMap: ParamMap) => {
        this.name = paramMap.get('name');
        this.filter = '';
        return this.fetchSecurityRules();
      })
    ).subscribe(this.refreshRules.bind(this));
    this.fetchNetworks();
  }

  refreshRules(res) {
    this.rules = res.data;
    this.pagination = res.pagination;
    this.loading = false;
  }

  fetchSecurityRules() {
    this.loading = true;
    return this.service.getNetworkSecurityRules(this.name, this.filter);
  }

  fetchData() {
    this.fetchSecurityRules()
          .subscribe(this.refreshRules.bind(this));
  }
  fetchNetworks() {
    this.service.fetchList({
      page: 0,
      size: 0
    }).subscribe(res => {
      this.networks = res.data;
      this.amount = res.pagination.total;
      this.makeSubMenuItems();
    });
  }

  makeSubMenuItems() {
    const submenuItems = this.networks.map((tenant) => ({
      name: tenant.name,
      url: `/management/detail/${tenant.name}`,
    }));
    this.submenuItems = submenuItems;
  }

  openAddModal(size = 'lg') {
    return this.modal.open(AddComponent, {
      title: this.translateService.translateKey('NETWORK.CREATE_NETWORK_RULE'),
      size,
      data: {
        networkName: this.name,
        networks: this.networks
      }
    }).subscribe((argu: string) => {
      this.fetchSecurityRules()
        .subscribe(this.refreshRules.bind(this));
    });
  }

  removeRule(rule) {
    this.loading = true;
    const params: any = {};
    params.address = rule.address;
    params.cidr = rule.cidr;
    params.policy = rule.policy;
    params.port = rule.port;
    this.service.removeSecurityRule(this.name, params)
      .subscribe(res => {
        this.message.success(res.message || 'removed');
        this.fetchSecurityRules()
          .subscribe(this.refreshRules.bind(this));
      });
  }

}
