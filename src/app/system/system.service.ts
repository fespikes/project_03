import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TecApiService } from '../shared';
import { Pagination } from 'tdc-ui';

@Injectable()
export class SystemService {

  constructor(private api: TecApiService) { }

}
