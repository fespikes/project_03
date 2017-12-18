import {
  Component,
  OnInit,
  HostBinding,
} from '@angular/core';

import { SubmenuItem } from 'tdc-ui';

@Component({
  selector: 'tec-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass'],
})
export class ChartComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  menuItems: SubmenuItem[] = [];

  menuTitle = 'Charts';

  routePrefix = 'chart';

  constructor() { }

  ngOnInit() {
    this.genMenuItems();
  }

  genMenuItems() {
    this.menuItems = [
      {
        name: 'Line chart',
        url: `${this.routePrefix}/line`,
      },
    ];
  }

}
