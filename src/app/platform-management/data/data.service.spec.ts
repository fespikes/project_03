import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MockBackend } from '@angular/http/testing';
import { TuiMessageService } from 'tdc-ui';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';
import { DataService } from './data.service';
import { TecApiService } from 'app/shared';

describe('DataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      OverlayModule,
      RouterTestingModule
    ],
    providers: [
      DataService,
      TecApiService,
      MockBackend,
      TuiMessageService,
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({}),
        },
      }
    ],
  }));

  it('should be created', () => {
    const service: DataService = TestBed.get(DataService);
    expect(service).toBeTruthy();
  });
});
