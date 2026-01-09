import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerShippingDetailVerificationComponent } from './customer-shipping-detail-verification-component';

describe('CustomerShippingDetailVerificationComponent', () => {
  let component: CustomerShippingDetailVerificationComponent;
  let fixture: ComponentFixture<CustomerShippingDetailVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerShippingDetailVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerShippingDetailVerificationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
