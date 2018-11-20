import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { TecApiService } from '../shared';
import { TaskFilter } from './tasks.model';
import { Task } from '../shared';

@Injectable()
export class TasksService {

  constructor(private api: TecApiService) { }

  getTasks(filter?: TaskFilter): Observable<any> {
    return this.api.get(`jobs`, {...filter});
  }

  getStatus(): Observable<any> {
    return this.api.get('jobs/statuses');
  }

  removeTask(id: string): Observable<any> {
    return this.api.delete(`jobs/${id}`);
  }
}
