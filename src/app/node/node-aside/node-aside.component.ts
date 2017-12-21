import { Component, Input, Output, OnInit, HostBinding, EventEmitter, ElementRef } from '@angular/core';
import { NodeService } from '../node.service';
import { NodeListSummary, NodeFilter } from '../node.model';

@Component({
  selector: 'tec-node-aside',
  templateUrl: './node-aside.component.html',
  styleUrls: ['./node-aside.component.sass'],
})
export class NodeAsideComponent implements OnInit {
  @Input() filter;
  @Output() filterChange = new EventEmitter();
  coreOptions;
  theSelectorOption;
  asideData = new NodeListSummary;

  constructor(
    private nodeService: NodeService,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.nodeService.fetchNodeSummary().subscribe(response => {
      this.asideData = {...response.data};
      this.coreOptions = response.data.coreOptions;
    });
  }

  onReset($event) {
    this.filter = new NodeFilter();
    this.filterChange.emit(this.filter);
  }

  onFilterOptionsSelect($event, type: string) {
    this.filter.status = type;
    this.filterChange.emit(this.filter);
  }

  toggleNewJoined() {
    if (this.filter.newJoined) {
      delete this.filter.newJoined;
    } else {
      this.filter.newJoined = true;
    }
    this.filterChange.emit(this.filter);
  }

  onSelectCoreNum() {
    this.filterChange.emit(this.filter);
  }

}
