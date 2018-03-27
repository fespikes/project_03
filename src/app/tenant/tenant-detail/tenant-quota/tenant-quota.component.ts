import {
  Component, OnInit,
  HostBinding,
} from '@angular/core';

import { TenantService } from '../../tenant.service';
import { Quota } from '../../tenant-model';
import { editTypes } from '../../../shared';

@Component({
  selector: 'tec-tenant-quota',
  templateUrl: './tenant-quota.component.html',
  styleUrls: ['./tenant-quota.component.sass'],
})
export class TenantQuotaComponent implements OnInit {
  @HostBinding('class.layout') hostClass = true;

  loading;
  editing = false;
  editingKey = '';
  quotas: Array<Quota>;
  group: object = {};

  constructor(
    private tenantService: TenantService,
  ) {}

  ngOnInit() {
    this.fetchQuotas();
  }

  fetchQuotas() {
    this.loading = true;

    this.tenantService.fetchQuotas()
      .subscribe((result) => {
        this.quotas = result.quotas;
        this.loading = false;
      });
  }

  onSubmit() {
    const quota = this.quotas[this.editingKey];
    this.loading = true;

    this.tenantService.putQuotas({
      name: quota['name'],
      limit: quota['limit'],
    }).subscribe(res => {
      this.loading = false;
    });
  }

  // types: 'edit', 'save', 'cancel'
  onEditChange($event) {
    console.log($event);

    switch ($event.type) {
      case editTypes.edit:
        this.editing = true;
        this.editingKey = $event.key;
        break;
      case editTypes.cancel:
        this.editing = false;
        break;
      case editTypes.save:
        this.editing = false;
        this.onSubmit();
        break;

      default:
        break;
    }
  }
}
