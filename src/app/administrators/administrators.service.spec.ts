import { TestBed, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { TuiMessageService } from 'tdc-ui';
import { HttpClientModule } from '@angular/common/http';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayModule } from '@angular/cdk/overlay';

import { TecApiService } from '../shared';
import { AdministratorsService } from './administrators.service';

describe('AdministratorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        OverlayModule,
      ],
      providers: [
        AdministratorsService,
        TecApiService,
        MockBackend,
        TuiMessageService,
        Overlay,
      ],
    });
  });

  it('should be created', inject([AdministratorsService], (service: AdministratorsService) => {
    expect(service).toBeTruthy();
  }));
});
