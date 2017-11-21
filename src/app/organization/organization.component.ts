import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.sass'],
})
export class OrganizationComponent implements OnInit {
  @HostBinding('class.tec-layout-body') hostClass = true;

  constructor() { }

  ngOnInit() {
  }

}
