import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantNetworkComponent } from './tenant-network.component';

describe('TenantNetworkComponent', () => {
  let component: TenantNetworkComponent;
  let fixture: ComponentFixture<TenantNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
