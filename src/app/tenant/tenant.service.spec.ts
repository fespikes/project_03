import { TestBed, inject } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { TenantService } from './tenant.service';
import { TecApiService } from '../shared';

describe('TenantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TenantService,
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

  it('should be created', inject([TenantService], (service: TenantService) => {
    expect(service).toBeTruthy();
  }));
});
