import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Pagination, TuiMessageService } from 'tdc-ui';
import { TranslateService } from '../i18n';
import { TicketService } from './ticket.service';

import { TicketFilter, Ticket, Statuses } from './ticket.model';


@Component({
  selector: 'tec-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.sass'],
})
export class TicketComponent implements OnInit {
  @HostBinding('class.tui-layout-body') hostClass = true;

  loading = false;
  pagination = new Pagination();
  tableData: any[] = [];
  filter = new TicketFilter();
  search: string;
  statuses = Statuses;
  sortMode: 'single';  // 'multiple'
  options: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: TicketService,
    private translateService: TranslateService,
    private message: TuiMessageService,
  ) { }

  ngOnInit() {
    const options = [{
      type: '', // TODO:
      typeAlias: this.translateService.translateKey('TICKET.All'),
    }];
    this.service.getTicketsServiceTypes()
      .subscribe(res => {
        res.forEach(item => {
          options.push(item);
        });
        this.options = options;
        this.filter.types = this.options[0]['typeAlias'];
      });

    this.fetchData();
  }

  showResolved() {
    this.pagination.page = 1;
    this.fetchData();
  }

  fetchData(changes?, fromStart = false) {
    this.loading = true;
    this.filter.page = this.pagination.page;
    this.filter.size = this.pagination.size;
    if (!!this.search) {
      this.filter.keywords = [this.search];
    }

    if (changes && changes.sortedBy) {
      const {sortedBy, order} = changes;
      this.filter.sortedBy = sortedBy;
      this.filter.order = order;
    } else {
      delete this.filter.order;
      delete this.filter.sortedBy;
    }

    this.service.getTickets(this.filter).subscribe(res => {
      this.tableData = res.data;
      this.pagination = res.pagination;
      this.loading = false;
    });

  }

  gotoTicketDetail(ticket: Ticket) {
    const id = ticket.id;
    const navigationExtras: NavigationExtras = {
      queryParams: { 'isResolved': this.filter.isResolved },
      relativeTo: this.route,
    };

    this.router.navigate([`./detail/${id}`], navigationExtras);
  }

}
