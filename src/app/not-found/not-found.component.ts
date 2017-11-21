import { Component, HostBinding } from '@angular/core';

@Component({
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.sass'],
})
export class NotFoundComponent {
  @HostBinding('class.tui-layout-body') host = true;

  constructor() {}
}
