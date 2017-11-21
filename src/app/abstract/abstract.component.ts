import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-abstract',
  templateUrl: './abstract.component.html',
  styleUrls: ['./abstract.component.sass'],
})
export class AbstractComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  constructor() { }

  ngOnInit() {
  }

}
