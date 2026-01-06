import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlacementConfirmationComponent } from './order-placement-confirmation-component';

describe('OrderPlacementConfirmationComponent', () => {
  let component: OrderPlacementConfirmationComponent;
  let fixture: ComponentFixture<OrderPlacementConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPlacementConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPlacementConfirmationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
