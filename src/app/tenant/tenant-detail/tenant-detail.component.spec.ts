import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { TabPaneDirective, TuiModalService } from 'tdc-ui';

import { TenantDetailComponent } from './tenant-detail.component';
import { TenantService } from '../tenant.service';
import { TranslatePipeStub } from 'app/mock';

class RouterStub {
  navigateByUrl() { }
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
          useFactory: (r: Router) => r.routerState.root,
          deps: [ Router ],
        },
        {
          provide: TuiModalService,
          useClass: TuiModalServiceStub,
        },
        {
          provide: TenantService,
          useClass: TenantServiceStub,
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
