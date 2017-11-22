import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.sass'],
})
export class TenantComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  constructor() { }

  ngOnInit() {
  }

}
