import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  quit($event) {
    console.log('quit ....', $event);
    // TODO: request and refresh page
  }

}
