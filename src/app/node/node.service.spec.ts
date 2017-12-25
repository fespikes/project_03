import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { NodeService } from './node.service';
import { TecApiService } from '../shared';

describe('NodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NodeService, {
          provide: TecApiService,
          useValue: {
            get() {
              return Observable.of();
            },
          },
        } ],
    });
  });

  it('should be created', inject([NodeService], (service: NodeService) => {
    expect(service).toBeTruthy();
  }));
});
