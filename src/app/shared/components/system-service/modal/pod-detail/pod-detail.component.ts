
import {map} from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TuiModalRef, TUI_MODAL_DATA, TuiModalService } from 'tdc-ui';
import { SystemService } from '../../service/system.service';
import {
  ServicePod,
  ServicePodContainer,
  ServicePodEvent,
  ServicePodLog,
} from '../../model/system-model';

const LOG_TRUNCATE_LENGTH = 100;

@Component({
  selector: 'tec-modal-pod-detail',
  templateUrl: './pod-detail.component.html',
  styleUrls: ['./pod-detail.component.sass'],
})
export class ModalPodDetailComponent implements OnInit {

  pod: ServicePod;
  uid: number;
  events: ServicePodEvent[];
  selectedLog: ServicePodLog;
  renderedLog: string;
  logs: ServicePodLog[];
  loadingLog: Boolean;

  get hasMoreLog() {
    if (!this.renderedLog || !this.selectedLog) {
      return false;
    }

    return this.renderedLog.length < this.selectedLog.logs.length;
  }

  constructor(
    private modalRef: TuiModalRef,
    private system: SystemService,
    @Inject(TUI_MODAL_DATA) data,
  ) {
    this.pod = data.pod;
    this.uid = data.uid;
  }

  ngOnInit() {
    this.getPodEvents().subscribe();
    this.getPodLogs().subscribe();
  }

  getPodEvents() {
    return this.system.getPodEvents(this.pod.name, this.uid).pipe(
    map(result => {
      this.events = result;
    }));
  }

  getPodLogs() {
    return this.system.getPodLogs(this.pod.name, this.uid).pipe(
    map(result => {
      this.logs = result;
      if (this.logs && this.logs.length > 0) {
        this.selectedLog = this.logs[0];
        this.renderedLog = this.selectedLog.logs.slice(0, LOG_TRUNCATE_LENGTH);
      }
    }));
  }

  onSelectLog() {
    this.renderedLog = this.selectedLog.logs.slice(0, LOG_TRUNCATE_LENGTH);
  }

  loadCompleteLog() {
    this.loadingLog = true;
    setTimeout(() => {
      this.renderedLog = this.renderedLog.concat(this.selectedLog.logs.slice(LOG_TRUNCATE_LENGTH));
      this.loadingLog = false;
    });
  }

  close() {
    this.modalRef.close();
  }

  confirm() {
   this.modalRef.close(true);
  }
}
