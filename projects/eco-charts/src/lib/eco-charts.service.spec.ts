import { TestBed } from '@angular/core/testing';

import { EcoChartsService } from './eco-charts.service';

describe('EcoChartsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EcoChartsService = TestBed.get(EcoChartsService);
    expect(service).toBeTruthy();
  });
});
