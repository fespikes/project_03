import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.sass'],
})
export class TenantDetailComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;  submenuItems = [];
  tenant = {};

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
