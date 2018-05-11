import { Component, OnInit, HostBinding, Injector } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { TranslateService } from '../../i18n';
import { SubmenuItem, TuiMessageService, TuiModalService } from 'tdc-ui';
import { TicketService } from '../ticket.service';
import { Ticket, Statuses } from '../ticket.model';
import { ConfirmComponent } from '../confirm/confirm.component';

// TODO: remove
import { ApplyInfo } from '../ticket.model';

@Component({
  selector: 'tec-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.sass'],
})
export class TicketDetailsComponent implements OnInit {

  @HostBinding('class.tui-layout-body') hostClass = true;
  myForm: FormGroup;
  loading = false;
  ticket: Ticket = new Ticket();
  filter: any = {
  };
  submenuItems: any[] = [];
  isResolved: boolean;
  statuses = Statuses;

  applyInfoTable: string;
  applyInfoColumns: string;
  applyInfoCycle: string;

  ticketChanges: any[];

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: TicketService,
    private message: TuiMessageService,
    private translateService: TranslateService,
    private modalService: TuiModalService,
    // private injector: Injector,
  ) {
    this.myForm = fb.group({
      'agreed': ['true', Validators.required],
      'comment': ['', Validators.compose([
          Validators.required,
        ])],
    });
  }

  ngOnInit() {
    this.getRouterParams();
    this.getMenuData();
  }

  getMenuData() {
    this.loading = true;
    this.service.getTickets().subscribe(res => {
      if (res.data && res.data.length > 0) {
        this.submenuItems = this.makeMenuItems(res.data);
        this.loading = false;
      } else {
        this.message.warning('no tickets, thus have no left menu');
      }
    });
  }

  getRouterParams() {
    const promises = [
      this.route.params,
      this.route.queryParams,
    ];
    let id: string;

    Observable.combineLatest(promises)
    .subscribe(([pathParams, queryParams]) => {
      id = pathParams['id'];
      this.isResolved = (queryParams['isResolved'] === 'true');

      if (!!id) {
        this.getTheTicket(id);
      } else {
        this.message.warning('no ticket details found'); // TODO:i18n
      }
    });
  }

  getTheTicket(id: string) {
    this.loading = true;
    this.service.getTheTicket(id).subscribe(res => {
      try {
        const applyInfo = res.payload.applyInfo;
        const ticketChanges = res.ticketChanges;
        this.getApplyData(applyInfo);
        this.getOperationRecord(ticketChanges);
        this.ticket = res;
        this.loading = false;
      } catch (e) {
        console.log(e.message);
      } finally {
        console.log('in response');
      }
    });
  }

  getApplyData(applyInfo) {
    const tableInfo = applyInfo.tableInfo;
    let columns = '';

    this.applyInfoTable = tableInfo. database + '.' + tableInfo.table;
    if ( tableInfo.columns && (tableInfo.columns.length > 0)) {
      tableInfo.columns.forEach((item, idx, arr) => {
        if (idx < arr.length - 1) {
          columns += item.name + '，';
        } else {
          columns += item.name ;
        }
      });
      this.applyInfoColumns = columns;
    } else {
      this.applyInfoColumns = '';
    }
    this.applyInfoCycle = applyInfo.schedule;
  }

  getOperationRecord(ticketChanges) {
    this.ticketChanges = ticketChanges;
    // mock
/*    this.ticketChanges = [
      {
        field: 'string',
        followUpId: 0,
        followUpTitle: 'string',
        id: 0,
        newValue: 'string',
        oldValue: 'string',
        operateTime: 0,
        operator: 'string',
        ticketId: 0,
      },
    ];*/
    // E: mock
  }

  makeMenuItems(items = []) {
    const submenuItems: SubmenuItem[] = items.map((item) => ({
      name: item.title,
      url: `/tickets/detail/${item.id}?isResolved=${this.isResolved}`,
      icon: 'user',
    }));

    return submenuItems;
  }

  // onSubmit(value: {[s: string]: string}) {
  //   this.popup(value);
  // }

  onSubmit(val: any, size = 'md') {
    const fields: any = {...val};
    let title: string;

    if (fields.agreed === 'true') {
      title = this.translateService.translateKey('TICKET.AGREE_ON_TICKET');
    } else {
      title = this.translateService.translateKey('TICKET.REJECT_TICKET');
    }

    return this.modalService.open(ConfirmComponent, {
      title: title,
      size,
      data: {
        fields: fields,
        ticket: this.ticket,
        poptitle: title,
      },
    }).subscribe(res => {
      this.getRouterParams();
      this.getMenuData();
    });
  }

}
