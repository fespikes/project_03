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
  profile: any = {
    fullName: '',
  };

  constructor(
    private layoutService: LayoutService,
  ) { }

  ngOnInit() {
    this.layoutService.getProfile().subscribe(res => {
      this.profile = res;
    });
  }

  quit($event) {
    // here when quit, Back end would handle
    // the session and redirect to cas login.
    this.layoutService.ssoLogout().subscribe(res => { });
  }

}
