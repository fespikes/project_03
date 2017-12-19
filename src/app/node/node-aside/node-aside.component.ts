import { Component, Input, Output, OnInit, HostBinding, EventEmitter, ElementRef } from '@angular/core';
import { NodeService } from '../node.service';
import { NodeListSummary, NodeFilter } from '../node.model';

import utils from '../node-utils';

@Component({
  selector: 'tec-node-aside',
  templateUrl: './node-aside.component.html',
  styleUrls: ['./node-aside.component.sass']
})
export class NodeAsideComponent implements OnInit {

  @Input() backUrl: string;
  @Input() filter;

  @Output() filterSelectStatus: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterSelectNewJoined: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterReset: EventEmitter<any> = new EventEmitter<any>();
  @Output() reselect: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class.tcc-submenu-collapsed') collapsed = false;
  @HostBinding('class.tcc-submenu') true;

  coreOptions = [ 12, 24 ];


  theSelectorOption;

  asideData = new NodeListSummary;

  constructor(
    private service: NodeService,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.service.fetchNodeSummary().subscribe(response=>{
      console.log({...response.data});
      this.asideData = {...response.data};
      this.coreOptions = response.data.coreOptions;
    });

    let element = this.el.nativeElement;
    element.querySelector('.tui-submenu-toggle').style.display = 'none';
  }

  onScreen($event) {
    let type= utils.getTypeRef($event);

    switch (type) {
      case 'reset':
        this.filter.reset();
        this.filterReset.emit($event);
        break;

      case 'HEALTHY':
      case 'BROKEN':
      case 'RISKY':
        this.filter.status = type;
        this.filterSelectStatus.emit(type);
        break;

      case 'newJoined':
        if(this.filter.newJoined) {
          delete this.filter.newJoined;
          this.filterSelectNewJoined.emit(false);
        } else {
          this.filter.newJoined = true
          this.filterSelectNewJoined.emit(true);
        }
        break;

      default:
        // code...
        break;
    }
  }

  toggle() {
    //TODO:
    this.collapsed = !this.collapsed;
    this.service.notifyToggle();
  }

  fetchData() {
    this.reselect.emit(this.filter.coreNum);
  }

}
