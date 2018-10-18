import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.sass']
})
export class ApprovalComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;
  selectedIndex = 0;
  loading: false;

  constructor() { }

  ngOnInit() {
  }

  tabIndexChange(index: number) {
    this.selectedIndex = index;
  }

}
