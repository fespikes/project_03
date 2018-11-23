import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';

import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { AddComponent } from './add.component';
import { AdministratorsService } from '../administrators.service';
import { TecApiService } from '../../shared';
import { TuiModalRef, TuiMessageService } from 'tdc-ui';


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
        AdministratorsService,
        TecApiService,
      ]
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
