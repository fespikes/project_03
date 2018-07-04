import { Component, OnInit } from '@angular/core';

import { LayoutService } from '../../layout.service';

enum entrancesTemp {
  'kong dashboard' = 'kong',
  'grafana' = 'grafana',
  'prometheus' = 'prometheus',
  'milano' = 'milano',
}

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
    avatar: '/assets/images/admin.jpeg',
  };
  entrancesTemp: any = entrancesTemp;

  entrances: any;

  constructor(
    private layoutService: LayoutService,
  ) { }

  ngOnInit() {
    this.layoutService.getProfile().subscribe(res => {
      this.profile = res || this.profile;
    });

    this.layoutService.getEntrances().subscribe(res => {
      this.entrances = res || this.entrances;
    });
  }

  quit($event) {
    // here when quit, Back end would handle
    // the session and redirect to cas login.
    this.layoutService.ssoLogout();
  }

}
