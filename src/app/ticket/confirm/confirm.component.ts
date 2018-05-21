import { Component, OnInit, Inject, Injectable  } from '@angular/core';
import { TuiModalRef, TUI_MODAL_DATA, TuiMessageService } from 'tdc-ui';

import { TecUtilService } from '../../shared';
import { TicketService } from '../ticket.service';
import { TranslateService } from '../../i18n';
import { Ticket } from '../ticket.model';

@Component({
  selector: 'tec-confirm',
  template: `
    <p class="content">
      <svg
        class="the-icon"
        tuiIcon="exclamation-circle"
      ></svg>
      <span>{{'TICKET.SURE' | translate}}</span>
      <span *ngIf="fields.agreed==='true'">{{'TICKET.AGREE_ON_TICKET' | translate}}</span>
      <span *ngIf="fields.agreed==='false'">{{'TICKET.REJECT_TICKET' | translate}}</span>
      <span class="highlight">{{ticket.title}}</span>?
    </p>
    <div class="buttons">
      <button
        class="left"
        tuiBtn="primary"
        (click)="submit()"
      >{{'TICKET.CONFIRM' | translate}}</button>
      <button
        class="right"
        tuiBtn="default"
        (click)="closeSelf()"
      >{{'TICKET.QUIT' | translate}}</button>
    </div>
  `,
  styles: [
    `.content{
      line-height: 100px;
      height: 102px;
      margin-bottom: 30px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
    }
    .the-icon{
      width: 60px; height: 60px;
      fill: #fda67a;
      margin: 0 20px;
    }
    .highlight{
      padding: 0 12px;
      color: #4c77d0;
    }
    .buttons{
      display: flex;
      justify-content: center;
    }
    .left{
      position: relative;
      left: -24px;
    }
    .right{
      position: relative;
      right: -24px;
    }
    `,
  ],
})
export class ConfirmComponent {

  fields: any = {};
  ticket: Ticket;
  poptitle: string;
  timer: any;
  toggle: boolean;

  constructor(
    private modal: TuiModalRef,
    @Inject(TUI_MODAL_DATA) data,
    private translateService: TranslateService,
    private service: TicketService,
    private message: TuiMessageService,
    private util: TecUtilService,
  ) {
    this.ticket = data.ticket || {};
    this.fields = data.fields;
    this.poptitle = data.poptitle;
  }

  submit() {
    const param: any = {
      ticketId: this.ticket.id,
      followUpEntity: this.fields,
    };

    if (this.toggle) {
      return;
    }

    this.toggle = true;
    this.service.updateTheTicket(param)
      .subscribe(res => {
        if (this.util.checkSucceed(res)) {
          this.message.success(this.poptitle + this.translateService.translateKey('TICKET.SUCCEED'));
        } else {
          this.message.error(this.poptitle + this.translateService.translateKey('TICKET.FAILURE'));
        }
        this.closeSelf();
      });

    setTimeout(() => {
        this.toggle = false;
    }, 500);

  }

  closeSelf() {
    this.modal.close('closed');
  }

}
