import { TestBed, inject } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { NodeService } from './node.service';
import { TecApiService } from '../shared';

describe('NodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NodeService, {
          provide: TecApiService,
          useValue: {
            get() {
              return of();
            },
          },
        } ],
    });
  });

  it('should be created', inject([NodeService], (service: NodeService) => {
    expect(service).toBeTruthy();
  }));
});
