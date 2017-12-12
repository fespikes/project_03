import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TenantInstanceComponent } from './tenant-instance.component';
import { TranslatePipeStub } from 'app/mock';

describe('TenantInstanceComponent', () => {
  let component: TenantInstanceComponent;
  let fixture: ComponentFixture<TenantInstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        TenantInstanceComponent,
        TranslatePipeStub,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
