import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { TabPaneDirective, TuiModalService } from 'tdc-ui';

import { TenantDetailComponent } from './tenant-detail.component';
import { TenantService } from '../tenant.service';
import { TranslatePipeStub, TranslateServiceMock } from 'app/mock';
import { TranslateService } from 'app/i18n';
import { Subject } from 'rxjs';

class RouterStub {
  events = new Subject();
}

class TuiModalServiceStub {
  apiError() { }
}

class TenantServiceStub {
  fetchAllTenants() {
    return Observable.of([{
      uid: 123,
    }]);
  }
  fetchTenantsCount() {
    return Observable.of({
      count: 10,
      time: 0,
    });
  }
  fetchInfo() {
    return Observable.of({
      name: 'tenant',
    });
  }
}

describe('TenantDetailComponent', () => {
  let component: TenantDetailComponent;
  let fixture: ComponentFixture<TenantDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        TabPaneDirective,
        TenantDetailComponent,
        TranslatePipeStub,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({}),
            queryParams: Observable.of({}),
          },
        },
        {
          provide: TuiModalService,
          useClass: TuiModalServiceStub,
        },
        {
          provide: TenantService,
          useClass: TenantServiceStub,
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        {
          provide: Router,
          useClass: RouterStub,
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
