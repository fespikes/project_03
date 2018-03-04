import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { TuiModalRef } from 'tdc-ui';

import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { AddComponent } from './add.component';
import { AdministratorsService } from '../administrators.service';
import { TecApiService } from '../../shared';


describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        TranslatePipeStub,
        DefaultPipeStub,
        AddComponent,
      ],
      providers: [
        TuiModalRef,
        AdministratorsService,
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
