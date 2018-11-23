import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';

import { SystemComponent } from './system.component';
import { SystemService, SystemModalService } from 'app/shared';
import { SystemModuleService } from './system.service';
import { TranslateService } from 'app/i18n';
import { TuiModalService } from 'tdc-ui';
import { MockModule, TranslateServiceMock } from 'app/mock';


class SystemServiceStub {
  getServiceLabels() {
    return of();
  }
  startService() {
    return of();
  }
  stopService() {
    return of();
  }
}

class ModalServiceStub {
  openPodModal() {
    return of(true);
  }

  openImageModal() {
    return of(true);
  }

  openYamlModal() {
    return of(true);
  }
}

describe('SystemComponent', () => {
  let component: SystemComponent;
  let fixture: ComponentFixture<SystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ MockModule ],
      declarations: [
        SystemComponent,
      ],
      providers: [
        {
          provide: SystemModalService,
          useClass: ModalServiceStub,
        },
        {
          provide: TuiModalService,
          useValue: {
            apiError() {},
          },
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        {
          provide: SystemService,
          useClass: SystemServiceStub,
        },
        {
          provide: SystemModuleService,
          useValue: {
            getServiceList() {
              return of();
            },
          },
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
