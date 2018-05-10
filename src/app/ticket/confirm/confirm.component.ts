import { Component, OnInit, Inject, Injectable  } from '@angular/core';
import { TuiModalRef, TUI_MODAL_DATA, TuiMessageService } from 'tdc-ui';

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

  constructor(
    private modal: TuiModalRef,
    @Inject(TUI_MODAL_DATA) data,
    private translateService: TranslateService,
    private service: TicketService,
    private message: TuiMessageService,
  ) {
    this.ticket = data.ticket || {};
    this.fields = data.fields;
  }

  submit() {
    const param: any = {
      ticketId: this.ticket.id,
      followUpEntity: this.fields,
    };
    this.service.updateTheTicket(param)
      .subscribe(res => {
        this.message.warning('no tickets, thus have no left menu');
        this.closeSelf();
      });
  }

  closeSelf() {
    this.modal.close('closed');
  }

}
