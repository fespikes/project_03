import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  constructor() { }

  ngOnInit() {
  }

}
