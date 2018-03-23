import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {  MockModule } from 'app/mock';
import { SystemComponent } from './system.component';
import { SystemService } from './service/system.service';
import { ServiceDurationPipe } from './pipe/duration.pipe';
import { SystemModalService } from './modal/system.modal.service';
import { TranslateService } from 'app/i18n';
import { TuiModalService } from 'tdc-ui';
import { TranslateServiceMock } from 'app/mock';


class SystemServiceStub {
  getInstanceList() {
    return Observable.of({
      data: [],
      pagination: {},
    });
  }
  getInstanceLabels() {
    return Observable.of();
  }
  startInstance() {
    return Observable.of();
  }
  stopInstance() {
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
        ServiceDurationPipe,
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
