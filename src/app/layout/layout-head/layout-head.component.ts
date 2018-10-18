import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'tec-layout-head',
  templateUrl: './layout-head.component.html',
  styleUrls: ['./layout-head.component.sass'],
})
export class LayoutHeadComponent {
  @HostBinding('class.tui-layout-head') hostClass = true;

  // WARP-21827: templately hide ticket tab and all related parts:
  navs = ['abstract', 'tenant', 'node', 'system', 'approval'].map((nav) => {
    return {
      link: '/' + nav,
      name: `LAYOUT.${nav.toUpperCase()}`,
    };
  });

}
