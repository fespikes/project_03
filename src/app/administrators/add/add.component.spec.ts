import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { AddComponent } from './add.component';
import { AdministratorsService } from '../administrators.service';
import { TecApiService } from '../../shared';
import { TuiModalRef, TuiMessageService } from 'tdc-ui';

class ServiceStub {

  features = {
    user: {}
  };
  addAdministrator(val = {}): Observable<any> {
    return of([]);
  }

}
describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
      ],
      declarations: [
        TranslatePipeStub,
        DefaultPipeStub,
        AddComponent,
      ],
      providers: [
        TuiModalRef,
        TuiMessageService,
        {
          provide: AdministratorsService,
          useFactory: () => {
            return new ServiceStub();
          }
        },
        TecApiService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
