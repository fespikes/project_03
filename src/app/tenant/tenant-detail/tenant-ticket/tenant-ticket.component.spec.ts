import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantTicketComponent } from './tenant-ticket.component';

describe('TenantTicketComponent', () => {
  let component: TenantTicketComponent;
  let fixture: ComponentFixture<TenantTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
