import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.sass'],
})
export class MessageComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  constructor() { }

  ngOnInit() {
  }

}
