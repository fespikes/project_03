import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-layout-head',
  templateUrl: './layout-head.component.html',
  styleUrls: ['./layout-head.component.sass'],
})
export class LayoutHeadComponent {
  @HostBinding('class.tui-layout-head') hostClass = true;

  navs = ['abstract', 'tenant', 'management', 'tasks', 'tickets'].map((nav) => {
    return {
      link: '/' + nav,
      name: `LAYOUT.${nav.toUpperCase()}`,
    };
  });

}
