import { NO_ERRORS_SCHEMA, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatePipeStub } from '../../mock';
import { LayoutHeadComponent } from './layout-head.component';

describe('LayoutHeadComponent', () => {
  let component: LayoutHeadComponent;
  let fixture: ComponentFixture<LayoutHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LayoutHeadComponent, TranslatePipeStub],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
