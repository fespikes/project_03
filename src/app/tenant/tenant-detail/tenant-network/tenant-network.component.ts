import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TenantService } from '../../tenant.service';
import { Network } from './tenant-network-model';

@Component({
  selector: 'tec-tenant-network',
  templateUrl: './tenant-network.component.html',
  styleUrls: ['./tenant-network.component.sass'],
})
export class TenantNetworkComponent implements OnInit {
  loading = false;

  search;
  tableData: Network[] = [];
  backup: Network[] = [];

  constructor(
    private tenantService: TenantService,
    private router: Router, private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getNetworks();
  }

  getNetworks() {
    this.loading = true;

    // frontEnd search
    this.tenantService.getNetworks().subscribe(res => {
      this.loading = false;
      this.tableData = res.data;
      this.backup = res.data;
      sessionStorage.setItem('eco:tenant:detail:networks', JSON.stringify(res.data));
    });
  }

  onViewDetails(datum: Network) {
    const uid = this.tenantService.uid;
    const networkName = datum.name;
    this.router.navigate([`${networkName}`], {
      relativeTo: this.route,
    });
  }

  onDelete(datum: Network) {
    this.loading = true;
    this.tenantService.deleteNetwork(datum.name).subscribe(res => {
      this.loading = false;
      this.getNetworks();
    });
  }

  onSearch(fromStart = false) {
    if (!this.search) {
      this.tableData = this.backup;
    } else {
      this.tableData = this.backup.filter((datum) => {
      let match = true;

      if (this.search) {
        match = match && (datum.name.indexOf(this.search) > 0);
      }
      return match;
    });
    }
  }

}
