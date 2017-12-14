import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IconDirective } from 'tdc-ui';
import { IconStatusDirective } from './icon-status.directive';

@Component({
  selector: 'tec-icon-status',
  template: '<svg tuiIcon [tecIconStatus]="status"></svg>',
})
class IconStatusComponent {
  status: string;
}

describe('IconStatusDirective', () => {
  let component: IconStatusComponent;
  let fixture: ComponentFixture<IconStatusComponent>;
  let svg: SVGUseElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IconStatusComponent,
        IconDirective,
        IconStatusDirective,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconStatusComponent);
    component = fixture.componentInstance;
    svg = fixture.debugElement.query(By.directive(IconStatusDirective)).nativeElement;
    component.status = 'ACTIVATING';
    fixture.detectChanges();
  });

  it('should render use element', () => {
    expect(svg.firstElementChild.tagName.toLowerCase()).toBe('use');
    expect(svg.firstElementChild.getAttribute('xlink:href')).toBe('#circle');
  });
});
