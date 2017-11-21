import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutHeadComponent } from './layout-head.component';

describe('LayoutHeadComponent', () => {
  let component: LayoutHeadComponent;
  let fixture: ComponentFixture<LayoutHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
