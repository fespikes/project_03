import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverflowContainerComponent } from './overflow-container.component';

describe('OverflowContainerComponent', () => {
  let component: OverflowContainerComponent;
  let fixture: ComponentFixture<OverflowContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverflowContainerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverflowContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
