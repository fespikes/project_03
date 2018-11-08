import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination, TuiModalService, TuiModalConfig } from 'tdc-ui';
import { TranslateService } from 'app/i18n';
import { TenantService } from 'app/tenant/tenant.service';
import { ModalBillClearComponent, ModalBillCorrectComponent } from './';

@Component({
  selector: 'tec-tenant-bill',
  templateUrl: './tenant-bill.component.html',
  styleUrls: ['./tenant-bill.component.sass'],
})
export class TenantBillComponent implements OnInit {
  @Input() uid: string;
  pagination = new Pagination();
  loading;
  keyword;

  bills = [];
  constructor(
    private route: ActivatedRoute,
    private tenantService: TenantService,
    private modal: TuiModalService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.fetchBills().subscribe();
  }

  paginationChange() {
    this.fetchBills().subscribe();
  }

  search() {
    this.fetchBills().subscribe();
  }

  fetchBills() {
    this.loading = true;
    return this.tenantService.fetchBills(this.uid, this.pagination, this.keyword)
      .map((result) => {
        this.bills = result.data;
        this.pagination = result.pagination;
        this.loading = false;
      });
  }

  openClearBillModal(bill) {
    const config: TuiModalConfig = {
      title: this.translate.translateKey('TENANT.BILL.CLEAR'),
      data: bill,
    };

    this.modal.open(ModalBillClearComponent, config)
      .subscribe(() => {
        this.fetchBills().subscribe();
      });
  }

  openCorrectBillModal(bill) {
    const config: TuiModalConfig = {
      title: this.translate.translateKey('TENANT.BILL.CORRECT'),
      data: bill,
    };

    this.modal.open(ModalBillCorrectComponent, config)
      .subscribe(() => {
        this.fetchBills().subscribe();
      });
  }

}
