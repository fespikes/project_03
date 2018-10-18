import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { ApprovalService } from './approval.service';
import { TecApiService } from '../shared';

describe('ApprovalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApprovalService,
        {
          provide: TecApiService,
          useValue: {
            get() {
              return Observable.of();
            },
          },
        }
      ]
    });
  });

  it('should be created', inject([ApprovalService], (service: ApprovalService) => {
    expect(service).toBeTruthy();
  }));
});
