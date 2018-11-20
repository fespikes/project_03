import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, ViewChild, NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AbstractComponent } from './abstract.component';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';

import { TranslateService } from '../i18n';
import { SelectComponent } from 'tdc-ui';
import { AbstractService } from './abstract.service';
import { AbstractServiceStub } from './abstract.service.stub';

import { TecUtilService, TimeOption } from '../shared';

describe('AbstractComponent', () => {
  let abstractComponent: AbstractComponent;
  let fixture: ComponentFixture<AbstractComponent>;
  const timeOption: TimeOption = new TimeOption;
  const fn = _ => _;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],

      declarations: [
        AbstractComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],

      providers: [{
        provide: AbstractService,
        useClass: AbstractServiceStub,
      },
      {
        provide: TecUtilService,
        useValue: {
          getSelectOptions() {
            return [];
          },
        },
      },
      {
        provide: TranslateService,
        useValue: {
          get() {
            return of();
          },
          translateKey() {},
        },
      }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractComponent);
    abstractComponent = fixture.componentInstance;

    abstractComponent.instancesAmountTrendOption = {...timeOption};
    abstractComponent.nodeAmountTrendOption = {...timeOption};
    abstractComponent.nodeLoadTrendOption = {...timeOption};
    abstractComponent.platformSummaryOption = {...timeOption};
    abstractComponent.productsInstancesRankingOption = {...timeOption};
    abstractComponent.productsInstancesTrendOption = {...timeOption};
    abstractComponent.tenantConsumptionRankingOption = {...timeOption};
    abstractComponent.tenantGrowTrendOption = {...timeOption};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(abstractComponent).toBeTruthy();
  });
});
