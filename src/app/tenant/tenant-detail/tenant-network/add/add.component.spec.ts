import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { AddComponent } from './add.component';
import { TenantService } from '../../../tenant.service';
import { TecApiService } from 'app/shared';
import { TuiModalRef } from 'tdc-ui';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [
        AddComponent,
        TranslatePipeStub,  // no translation
        DefaultPipeStub,
      ],
      providers: [
        TuiModalRef,
        TecApiService,
        TenantService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;

    // component.myForm = new FormGroup({});
    component.policies = [];
    component.protocols = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
