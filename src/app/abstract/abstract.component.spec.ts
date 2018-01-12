import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, ViewChild, NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';

import { AbstractComponent } from './abstract.component';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';

import { TranslateService } from '../i18n';
import { SelectComponent } from 'tdc-ui';
import { AbstractService } from './abstract.service';
import { AbstractServiceStub } from './abstract.service.stub';

import { TimeOption } from './abstract.model';

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

    abstractComponent.loadsSelect.registerOnChange = fn;
    abstractComponent.tenantGrowTrendSelect.registerOnChange = fn;
    abstractComponent.nodeLoadTrendSelect.registerOnChange = fn;
    abstractComponent.nodeAmountTrendSelect.registerOnChange = fn;
    abstractComponent.productsInstancesRankingSelect.registerOnChange = fn;
    abstractComponent.instancesAmountTrendSelect.registerOnChange = fn;
    abstractComponent.productsInstancesTrendSelect.registerOnChange = fn;
    abstractComponent.tenantConsumptionRankingSelect.registerOnChange = fn;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(abstractComponent).toBeTruthy();
  });
});
