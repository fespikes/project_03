import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutHeadNavComponent } from './layout-head-nav.component';

describe('LayoutHeadNavComponent', () => {
  let component: LayoutHeadNavComponent;
  let fixture: ComponentFixture<LayoutHeadNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutHeadNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutHeadNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
