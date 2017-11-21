import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.sass'],
})
export class SystemComponent implements OnInit {
  @HostBinding('class.tec-layout-body') hostClass = true;

  constructor() { }

  ngOnInit() {
  }

}
