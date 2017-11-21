import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutHeadRightComponent } from './layout-head-right.component';

describe('LayoutHeadRightComponent', () => {
  let component: LayoutHeadRightComponent;
  let fixture: ComponentFixture<LayoutHeadRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutHeadRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutHeadRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
