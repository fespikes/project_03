import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgSrcDirective } from './img-src.directive';

@Component({
  template: '<img tecImgSrc="nav/service.png">',
})
class TestComponent { }

describe('ImageDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let image;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponent, ImgSrcDirective ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    image = fixture.debugElement.query(By.directive(ImgSrcDirective)).nativeElement;
  });

  it(`should set src with '/assets/images' prefix`, () => {
    expect(image.src).toContain('/assets/images/nav/service.png');
  });
});
