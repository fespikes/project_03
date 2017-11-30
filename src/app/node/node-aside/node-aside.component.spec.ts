import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeAsideComponent } from './node-aside.component';

describe('NodeAsideComponent', () => {
  let component: NodeAsideComponent;
  let fixture: ComponentFixture<NodeAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
