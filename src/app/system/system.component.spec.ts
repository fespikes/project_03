import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {  MockModule } from 'app/mock';
import { SystemComponent } from './system.component';
import { SystemService, SystemModalService, TecUtilService } from 'app/shared';
import { SystemModuleService } from './system.service';
import { TranslateService } from 'app/i18n';
import { TuiModalService } from 'tdc-ui';
import { TranslateServiceMock, TecUtilServiceMock } from 'app/mock';


class SystemServiceStub {
  getServiceLabels() {
    return Observable.of();
  }
  startService() {
    return Observable.of();
  }
  stopService() {
    return Observable.of();
  }
}

class ModalServiceStub {
  openPodModal() {
    return Observable.of(true);
  }

  openImageModal() {
    return Observable.of(true);
  }

  openYamlModal() {
    return Observable.of(true);
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
          provide: TecUtilService,
          useClass: TecUtilServiceMock
        },
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
              return Observable.of();
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
