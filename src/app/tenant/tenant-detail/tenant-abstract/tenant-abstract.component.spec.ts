import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { TranslatePipeStub, DefaultPipeStub } from '../../../mock';
import { TranslateService } from '../../../i18n';
import { TenantAbstractService } from './tenant-abstract.service';
import { TenantAbstractComponent } from './tenant-abstract.component';
import { TecUtilService, TimeOption } from '../../../shared';
import { TenantAbstractServiceStub } from './tenant-abstract.service.stub';

describe('TenantAbstractComponent', () => {
  let tenantAbstractComponent: TenantAbstractComponent;
  let fixture: ComponentFixture<TenantAbstractComponent>;
  const timeOption: TimeOption = new TimeOption;
  const fn = _ => _;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        TenantAbstractComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],

      providers: [{
        provide: TenantAbstractService,
        useClass: TenantAbstractServiceStub,
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
          translateKey() {},
        },
      }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantAbstractComponent);
    tenantAbstractComponent = fixture.componentInstance;

    tenantAbstractComponent.platformSummaryOption = {...timeOption};
    tenantAbstractComponent.instancesCountTrendOption = {...timeOption};
    tenantAbstractComponent.consumptionsTrendOption = {...timeOption};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(tenantAbstractComponent).toBeTruthy();
  });
});
