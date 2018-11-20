import { TestBed, inject } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { TecApiService } from '../shared';
import { AbstractService } from './abstract.service';
import { TranslateService } from '../i18n';

describe('AbstractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AbstractService, {
          provide: TecApiService,
          useValue: {
            get() {
              return of();
            },
          },
        },
        {
          provide: TranslateService,
          useValue: {
            get() {
              return of();
            },
          },
        }],
    });
  });

  it('should be created', inject([AbstractService], (service: AbstractService) => {
    expect(service).toBeTruthy();
  }));
});
