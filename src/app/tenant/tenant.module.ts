import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  TuiModalService,
  TableModule,
  IconModule,
  BtnModule,
} from 'tdc-ui';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { TenantService } from './tenant.service';
import { TenantAbstractService } from './tenant-detail/tenant-abstract/tenant-abstract.service';
import { TenantRoutingModule } from './tenant-routing.module';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { TenantDetailComponent } from './tenant-detail/tenant-detail.component';
import { TenantAbstractComponent } from './tenant-detail/tenant-abstract/tenant-abstract.component';
import { TenantInstanceComponent } from './tenant-detail/tenant-instance/tenant-instance.component';
import { TenantTicketComponent } from './tenant-detail/tenant-ticket/tenant-ticket.component';
import { TenantErrorComponent } from './tenant-detail/tenant-error/tenant-error.component';
import { TenantQuotaComponent } from './tenant-detail/tenant-quota/tenant-quota.component';
import { TenantNetworkComponent } from './tenant-detail/tenant-network/tenant-network.component';
import { TenantServiceComponent } from './tenant-detail/tenant-service/tenant-service.component';
import { TenantBillComponent } from './tenant-detail/tenant-bill/tenant-bill.component';
import { TenantStatusIconComponent } from './components/status-icon/status-icon.component';
import { ModalBillClearComponent } from './tenant-detail/tenant-bill/modal-bill-clear/modal-bill-clear.component';
import { ModalBillCorrectComponent } from './tenant-detail/tenant-bill/modal-bill-correct/modal-bill-correct.component';
import { NetworkRulesComponent } from './tenant-detail/tenant-network/network-rules/network-rules.component';
import { ModalDeleteTenantComponent } from './components/modal/delete-tenant.component';
import { OverviewComponent } from './overview/overview.component';
import { TenantAdminComponent } from './tenant-admin/tenant-admin.component';
import { SendRegisterLinkComponent } from './tenant-admin/send-register-link/send-register-link.component';
import { AddComponent as TenantAdminAddComponent } from './tenant-admin/add/add.component';
import { FailureCourseComponent } from './components/failure-course/failure-course.component';
import { DeleteComponent } from './tenant-admin/delete/delete.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    BtnModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    TenantRoutingModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [
    ModalBillClearComponent,
    ModalBillCorrectComponent,
    ModalDeleteTenantComponent,
    TenantListComponent,
    TenantDetailComponent,
    TenantAbstractComponent,
    TenantInstanceComponent,
    TenantTicketComponent,
    TenantErrorComponent,
    TenantQuotaComponent,
    TenantNetworkComponent,
    TenantServiceComponent,
    TenantBillComponent,
    ModalBillClearComponent,
    ModalBillCorrectComponent,
    NetworkRulesComponent,
    TenantStatusIconComponent,
    OverviewComponent,
    TenantAdminComponent,
    TenantAdminAddComponent,
    SendRegisterLinkComponent,
    FailureCourseComponent,
    DeleteComponent,
  ],
  providers: [
    TenantService,
    TuiModalService,
    TenantAbstractService,
  ],
  entryComponents: [
    ModalBillClearComponent,
    ModalBillCorrectComponent,
    ModalDeleteTenantComponent,
    TenantAdminAddComponent,
    SendRegisterLinkComponent,
    FailureCourseComponent,
    DeleteComponent
  ],
})
export class TenantModule { }
