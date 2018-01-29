import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

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
        }],
    });
  });

  it('should be created', inject([AbstractService], (service: AbstractService) => {
    expect(service).toBeTruthy();
  }));
});
