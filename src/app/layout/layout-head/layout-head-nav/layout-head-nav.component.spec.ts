import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { TranslatePipeStub, TranslateServiceMock } from '../../../mock';
import { TranslateService } from '../../../i18n';

import { LayoutHeadNavComponent } from './layout-head-nav.component';

@Component({
  selector: 'tec-wrapper-component',
  template: '<tec-layout-head-nav [style.width]="navWidth" [navs]="navs"></tec-layout-head-nav>',
})
class TestWrapperComponent {
  navWidth = '120px'; // one nav (50px) plus 'more' nav (70px)
  navs = [
    {
      name: 'LAYOUT.TEST_TAB_1',
      link: '/test1',
    },
    {
      name: 'LAYOUT.TEST_TAB_2',
      link: '/test2',
    },
    {
      name: 'LAYOUT.TEST_TAB_3',
      link: '/test3',
    },
  ];
}

class RouterStub {
  isActive() { }
}

// fix nav width in test env
function getEstimateNavWidthMock() {
  return 50;
}

describe('LayoutHeadNavComponent', () => {
  let component: LayoutHeadNavComponent;
  let wrapperComponent: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let translate: TranslateServiceMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        LayoutHeadNavComponent,
        TestWrapperComponent,
        TranslatePipeStub,
      ],
      providers: [
        {
          provide: Router,
          useClass: RouterStub,
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    translate = TestBed.get(TranslateService);

    fixture = TestBed.createComponent(TestWrapperComponent);
    wrapperComponent = fixture.debugElement.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    component.getEstimateNavWidth = getEstimateNavWidthMock;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();

    expect(component.displayNavs.length).toEqual(1);
    expect(component.overflowNavs.length).toEqual(2);
  });

  it('narrow nav bar, should put all navs in overflow dropdown', () => {
    wrapperComponent.navWidth = '70px';
    fixture.detectChanges();

    component.flowNavs();
    expect(component.displayNavs.length).toEqual(0);
    expect(component.overflowNavs.length).toEqual(3);
  });

  it('wide nav bar, should display all navs', () => {
    wrapperComponent.navWidth = '150px';
    fixture.detectChanges();

    component.flowNavs();
    expect(component.displayNavs.length).toEqual(3);
    expect(component.overflowNavs.length).toEqual(0);
  });

  it('window resize event', fakeAsync(() => {
    spyOn(component, 'flowNavs');

    const evt = new Event('resize');
    window.dispatchEvent(evt);
    fixture.detectChanges();
    tick(500);
    expect(component.flowNavs).toHaveBeenCalled();
  }));

  it('language change event', () => {
    spyOn(component, 'flowNavs');

    translate.onLangChange.emit();
    expect(component.flowNavs).toHaveBeenCalled();
  });
});
