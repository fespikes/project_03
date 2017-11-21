import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.sass']
})
export class TicketComponent implements OnInit {
  @HostBinding('class.tec-layout-body') hostClass = true;

  constructor() { }

  ngOnInit() {
  }

}
