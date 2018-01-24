import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { TecApiService } from '../../../shared';
import { TranslateService } from '../../../i18n';

import { TenantAbstractService } from './tenant-abstract.service';
import { DefaultPipeStub } from '../../../mock/';

describe('TenantAbstractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TenantAbstractService, {
          provide: TecApiService,
          useValue: {
            get() {
              return Observable.of();
            },
          },
        },
        {
          provide: TranslateService,
          useValue: {
            get() {
              return Observable.of();
            },
          },
        },
      ],
    });
  });

  it('should be created', inject([TenantAbstractService], (service: TenantAbstractService) => {
    expect(service).toBeTruthy();
  }));
});
