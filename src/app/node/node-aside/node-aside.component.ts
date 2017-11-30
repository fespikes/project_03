import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { NodeService } from '../node.service';

@Component({
  selector: 'tec-node-aside',
  templateUrl: './node-aside.component.html',
  styleUrls: ['./node-aside.component.sass']
})
export class NodeAsideComponent implements OnInit {

  @Input() backUrl: string;
  @HostBinding('class.tcc-submenu-collapsed') collapsed = false;
  @HostBinding('class.tcc-submenu') true;

  options = [
    {type: 'book'},
    {type: 'paper'},
  ];
  select;

  constructor(
    private service: NodeService,
  ) { }

  ngOnInit() {
  }

  toggle() {
    //TODO:
    this.collapsed = !this.collapsed;
    this.service.notifyToggle();
  }

  fetchData() {
    //TODO: trigger the XHR
    console.log('into fetch data', this.select);
  }

}
