import { Component, OnInit } from '@angular/core';
import { TuiModalService } from 'tdc-ui';

import { ActivatedRoute, Router } from '@angular/router';
import { TenantService } from '../../../tenant.service';
import { Network } from '../tenant-network-model';
import { AddComponent } from '../add/add.component';
import { TranslateService } from '../../../../i18n';

@Component({
  selector: 'tec-network-rules',
  templateUrl: './network-rules.component.html',
  styleUrls: ['./network-rules.component.sass'],
})
export class NetworkRulesComponent implements OnInit {

  loading = false;
  submenuItems: any[] = [];
  tenantsCount: 9;  // TODO:
  networkName = '';
  networkRules: Array<any>;
  backUrl = '../';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantService: TenantService,
    private modalService: TuiModalService,
    private translateService: TranslateService,
  ) { }
  ngOnInit() {
    const networks: any[] = JSON.parse(this.tenantService.networks);
    const uid = this.tenantService.uid;
    this.loading = true;

    this.submenuItems = networks.map(network => ({
      name: network.name,
      url: `tenant/detail/${uid}/${network.name}`,
      icon: '',
    }));

    this.fetchSecurityRules();

    const networkName = this.route.snapshot.paramMap.get('networkName');
    sessionStorage.setItem('eco:tenant:detail:networkName', networkName);
  }

  fetchSecurityRules() {
    this.route.params.subscribe(params => {
      this.networkName = params['networkName'];
      this.tenantService.getSecurityRules(this.networkName).subscribe(res => {
        this.networkRules = res.data;
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
    this.tenantService.deleteSecurityRule(this.networkName).subscribe(res => {
      this.loading = false;
      this.fetchSecurityRules();
    });
  }

}
