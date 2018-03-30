import { Component, Input } from '@angular/core';

@Component({
  selector: 'tec-tenant-status-icon',
  templateUrl: './status-icon.component.html',
  styleUrls: ['./status-icon.component.sass'],
})
export class TenantStatusIconComponent {
  @Input() status: string;
  @Input() alias: string;

}
