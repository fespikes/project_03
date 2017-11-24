import { Component, HostBinding } from '@angular/core';

@Component({
  template: '<tec-layout-head></tec-layout-head><router-outlet></router-outlet>',
})
export class LayoutComponent {
  @HostBinding('class.tui-layout') hostClass = true;
}
