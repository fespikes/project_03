import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantBillComponent } from './tenant-bill.component';

describe('TenantBillComponent', () => {
  let component: TenantBillComponent;
  let fixture: ComponentFixture<TenantBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
