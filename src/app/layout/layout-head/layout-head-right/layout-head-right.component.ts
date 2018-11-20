
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';


import { LayoutService } from '../../layout.service';

enum entrancesTemp {
  'kong dashboard' = 'kong',
  'grafana' = 'grafana',
  'prometheus' = 'prometheus',
  'milano' = 'milano',
  'zipkin' = 'zipkin',
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
  license: any = {};
  licenseEnum = {
    evaluation: 'EVALUATION',
    commercial: 'COMMERCIAL'
  };

  constructor(
    private layoutService: LayoutService,
  ) { }

  ngOnInit() {
    const observables = [
      this.layoutService.getProfile(),
      this.layoutService.getEntrances(),
    ];
    observableForkJoin(observables)
      .subscribe(([profile, entrances]) => {
        this.profile = profile || this.profile;
        this.entrances = entrances || this.entrances;
      });

    this.layoutService.metaDataService.fetMetaData(this.callback.bind(this));
  }

  callback(res) {
    this.license = res.license;
  }

  quit($event) {
    // here when quit, Back end would handle
    // the session and redirect to cas login.
    this.layoutService.ssoLogout();
  }

}
