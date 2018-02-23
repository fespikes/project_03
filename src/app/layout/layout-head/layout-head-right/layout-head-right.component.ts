import { Component, OnInit } from '@angular/core';

import { LayoutService } from '../../layout.service';

@Component({
  selector: 'tec-layout-head-right',
  templateUrl: './layout-head-right.component.html',
  styleUrls: ['./layout-head-right.component.sass'],
})
export class LayoutHeadRightComponent implements OnInit {
  messageCount = 2;
  dropdownDirection = 'bottomCenter';
  user: any = {
    name: 'rockwang',
  };

  constructor(
    private layoutService: LayoutService,
  ) { }

  ngOnInit() {
  }

  quit($event) {
    this.layoutService.ssoLogout().subscribe(res => {
      console.log('logout succeed. the next : ->', res);
      // TODO: api content no user info , need to make changes
      // TODO: redirect to outer page after logout
    });
  }

}
