import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-platform-management',
  templateUrl: './platform-management.component.html',
  styleUrls: ['./platform-management.component.sass']
})
export class PlatformManagementComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;
  private selectedIndex = 0;

  constructor() { }

  ngOnInit() {
  }

  tabIndexChange(index: number) {
    this.selectedIndex = index;
    console.log(index);
  }
}
