import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutOrderComponent } from './checkout-order-component';

describe('CheckoutOrderComponent', () => {
  let component: CheckoutOrderComponent;
  let fixture: ComponentFixture<CheckoutOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutOrderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
