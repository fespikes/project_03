import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TenantListComponent } from './tenant-list.component';
import { TenantService } from '../tenant.service';
import { TranslatePipeStub, DefaultPipeStub } from '../../mock';

class TenantServiceStub {
  fetchSummaries() {
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
}

describe('TenantListComponent', () => {
  let component: TenantListComponent;
  let fixture: ComponentFixture<TenantListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        TenantListComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],
      providers: [
        {
          provide: TenantService,
          useClass: TenantServiceStub,
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
