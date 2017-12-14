import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TuiModalService } from 'tdc-ui';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { TenantService } from './tenant.service';
import { TenantRoutingModule } from './tenant-routing.module';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { TenantDetailComponent } from './tenant-detail/tenant-detail.component';
import { TenantAbstractComponent } from './tenant-detail/tenant-abstract/tenant-abstract.component';
import { TenantInstanceComponent } from './tenant-detail/tenant-instance/tenant-instance.component';
import { TenantTicketComponent } from './tenant-detail/tenant-ticket/tenant-ticket.component';
import { TenantErrorComponent } from './tenant-detail/tenant-error/tenant-error.component';
import { TenantQuotaComponent } from './tenant-detail/tenant-quota/tenant-quota.component';
import { TenantNetworkComponent } from './tenant-detail/tenant-network/tenant-network.component';
import { TenantBillComponent } from './tenant-detail/tenant-bill/tenant-bill.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TenantRoutingModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [
    TenantListComponent,
    TenantDetailComponent,
    TenantAbstractComponent,
    TenantInstanceComponent,
    TenantTicketComponent,
    TenantErrorComponent,
    TenantQuotaComponent,
    TenantNetworkComponent,
    TenantBillComponent,
  ],
  providers: [
    TenantService,
    TuiModalService,
  ],
})
export class TenantModule { }
