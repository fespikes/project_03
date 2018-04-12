import { Component, OnInit } from '@angular/core';
import { TuiModalService } from 'tdc-ui';

import { ActivatedRoute, Router } from '@angular/router';
import { TenantService } from '../../../tenant.service';
import { Network } from '../tenant-network-model';
import { AddComponent } from '../add/add.component';
import { TranslateService } from '../../../../i18n';
import { Pagination } from 'tdc-ui';
import { NetworkRules } from '../../../tenant-model';

@Component({
  selector: 'tec-network-rules',
  templateUrl: './network-rules.component.html',
  styleUrls: ['./network-rules.component.sass'],
})
export class NetworkRulesComponent implements OnInit {

  loading = false;
  submenuItems: any[] = [];
  tenantsCount: 9;  // TODO:
  networkRules: Array<any>;
  backUrl = '../';
  pagination = new Pagination();
  networkRulesFilter: NetworkRules;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantService: TenantService,
    private modalService: TuiModalService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    const networks: any[] = JSON.parse(this.tenantService.networks);
    const uid = this.tenantService.uid;
    this.loading = true;
    this.networkRulesFilter = new NetworkRules();

    this.submenuItems = networks.map(network => ({
      name: network.name,
      url: `tenant/detail/${uid}/${network.name}`,
      icon: '',
    }));

    this.fetchSecurityRules();
  }

  fetchSecurityRules() {
    this.route.params.subscribe(params => {
      this.networkRulesFilter.networkName = params['networkName'];
      this.tenantService.getSecurityRules(this.networkRulesFilter).subscribe(res => {
        this.networkRules = res.data;
        this.pagination = res.pagination;
        this.loading = false;
      });
    });
  }

  create(size = 'lg') {
    return this.modalService.open(AddComponent, {
      title: this.translateService.translateKey('TENANT.NETWORK.CREATE_NET_RULES'),
      size,
    })
    .subscribe((word: string) => {
      this.fetchSecurityRules();
    });
  }

  remove(network: Network) {
    this.loading = true;
    this.tenantService.deleteSecurityRule(this.networkRulesFilter.networkName).subscribe(res => {
      this.loading = false;
      this.fetchSecurityRules();
    });
  }

}
