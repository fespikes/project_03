import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TenantInfo } from '../tenant-model';

@Component({
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.sass'],
})
export class TenantDetailComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;  submenuItems = [];
  tenant = new TenantInfo();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  navigateBack() {
    this.router.navigateByUrl('/tenant/overview');
  }

}
