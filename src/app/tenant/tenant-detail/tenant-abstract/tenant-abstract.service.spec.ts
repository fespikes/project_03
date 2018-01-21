import { TestBed, inject } from '@angular/core/testing';

import { TenantAbstractService } from './tenant-abstract.service';

describe('TenantAbstractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TenantAbstractService]
    });
  });

  it('should be created', inject([TenantAbstractService], (service: TenantAbstractService) => {
    expect(service).toBeTruthy();
  }));
});
