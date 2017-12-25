import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SystemComponent } from './system.component';
import {  MockModule } from 'app/mock';
import { TranslateService } from 'app/i18n';
import { SystemService } from '../service/system.service';
import { ServiceDurationPipe } from '../pipe/duration.pipe';

class SystemServiceStub {
  getServiceList() {
    return Observable.of();
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
          provide: TranslateService,
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
