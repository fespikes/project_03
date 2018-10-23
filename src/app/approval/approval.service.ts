import { Injectable } from '@angular/core';
import { TecApiService } from '../shared';
import { Observable } from 'rxjs/Observable';

import { BPMSTaskDetail } from './approval.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  constructor(private api: TecApiService) { }

  getTasks(filter = {}): Observable<any> {
    return this.api.get(`tasks`, filter);
  }

  getTaskTypes() {
    return this.api.get(`tasks/types`);
  }

  getTaskDetails(id): Observable<BPMSTaskDetail> {
    return this.api.get(`tasks/${id}`);
  }

  taskAdjustment(id, param): Observable<any> {
    return this.api.put(`tasks/${id}`, param);
  }

  getProcedures(): Observable<any> {
    return this.api.get(`procedures`);
  }

  getAssignees(): Observable<any> {
    return this.api.get(`assignees`);
  }

  editAssigneesRecursivly(id, assignees): Observable<any> {
    return this.api.put(`procedures/${id}/assignees`, [...assignees]);
  }


}
