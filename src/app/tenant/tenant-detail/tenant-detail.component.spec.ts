import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TabPaneDirective, TuiModalService } from 'tdc-ui';

import { TenantDetailComponent } from './tenant-detail.component';
import { TenantService } from '../tenant.service';
import { TranslatePipeStub } from '../../mock';

class RouterStub {
  navigateByUrl() { }
}

class TuiModalServiceStub {
  apiError() { }
}

class TenantServiceStub {
  fetchAllTenants() {
    return Observable.of({
      data: [],
    });
  }
  fetchTenantsCount() {
    return Observable.of({
      data: {
        count: 10,
        time: 0,
      },
    });
  }
  fetchInfo() {
    return Observable.of({
      data: {
        name: 'tenant',
      },
    });
  }
}

describe('TenantDetailComponent', () => {
  let component: TenantDetailComponent;
  let fixture: ComponentFixture<TenantDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        TabPaneDirective,
        TenantDetailComponent,
        TranslatePipeStub,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({ name: 'tenant1' }),
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
