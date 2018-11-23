import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MockBackend } from '@angular/http/testing';
import { OverlayModule } from '@angular/cdk/overlay';

import { TuiMessageService } from 'tdc-ui';
import { TecApiService } from 'app/shared';

import { EditService } from './edit.service';

describe('EditService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      OverlayModule
    ],
    providers: [
      EditService,
      TecApiService,
      MockBackend,
      TuiMessageService
    ]
  }));

  it('should be created', () => {
    const service: EditService = TestBed.get(EditService);
    expect(service).toBeTruthy();
  });
});
