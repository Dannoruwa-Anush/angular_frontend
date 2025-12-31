import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrderNavComponent } from './customer-order-nav-component';

describe('CustomerOrderNavComponent', () => {
  let component: CustomerOrderNavComponent;
  let fixture: ComponentFixture<CustomerOrderNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerOrderNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerOrderNavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
