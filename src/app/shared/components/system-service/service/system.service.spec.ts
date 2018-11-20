import { TestBed, inject } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { SystemService } from './system.service';
import { TecApiService } from '../../../services';

describe('TenantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SystemService,
        {
          provide: TecApiService,
          useValue: {
            get() {
              return of();
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
