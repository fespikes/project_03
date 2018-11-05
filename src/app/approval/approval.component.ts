import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'tec-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.sass']
})
export class ApprovalComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;
  selectedIndex = 0;
  loading: false;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const paramMap = this.route.snapshot.paramMap;
    const idx = +paramMap.get('idx');
    this.selectedIndex = idx || 0;
  }

  tabIndexChange(index: number) {
    this.selectedIndex = index;
  }

}
