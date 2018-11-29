import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass'],
})
export class OverviewComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  selectedIndex = 0;
  loading: false;

  constructor() { }

  ngOnInit() {
  }

  tabIndexChange(index: number) {
    this.selectedIndex = index;
    console.log(index);
  }

}
