import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, NavigationEnd } from '@angular/router';

@Component({
  selector: 'tec-platform-management',
  templateUrl: './platform-management.component.html',
  styleUrls: ['./platform-management.component.sass']
})
export class PlatformManagementComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;
  private selectedIndex = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.selectedIndex = +this.route.snapshot.queryParamMap.get('idx');
  }

  tabIndexChange(index: number) {
    this.selectedIndex = index;
    console.log(index);
  }
}
