import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { SystemService } from './system.service';
import { TecApiService } from '../../shared';

describe('TenantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SystemService,
        {
          provide: TecApiService,
          useValue: {
            get() {
              return Observable.of();
            },
          },
        },
      ],
    });
  });

  it('should be created', inject([SystemService], (service: SystemService) => {
    expect(service).toBeTruthy();
  }));
});
