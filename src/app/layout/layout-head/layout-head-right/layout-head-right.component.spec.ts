import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MockModule } from '../../../mock';
import { I18nLangService, TranslateService } from '../../../i18n';
import { LayoutHeadRightComponent } from './layout-head-right.component';

describe('LayoutHeadRightComponent', () => {
  let component: LayoutHeadRightComponent;
  let fixture: ComponentFixture<LayoutHeadRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MockModule],
      declarations: [ LayoutHeadRightComponent ],
      providers: [
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        },
      ],
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
