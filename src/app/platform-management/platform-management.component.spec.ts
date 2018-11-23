import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { TabPaneDirective, TuiModalService } from 'tdc-ui';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { PlatformManagementComponent } from './platform-management.component';
class RouterStub {
  events = new Subject();
}
describe('PlatformManagementComponent', () => {
  let component: PlatformManagementComponent;
  let fixture: ComponentFixture<PlatformManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      declarations: [
        PlatformManagementComponent,
        TabPaneDirective,
        TranslatePipeStub,
        DefaultPipeStub,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              queryParamMap: {
                get() {}
              }
            }
          },
        },
        {
          provide: Router,
          useClass: RouterStub,
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
