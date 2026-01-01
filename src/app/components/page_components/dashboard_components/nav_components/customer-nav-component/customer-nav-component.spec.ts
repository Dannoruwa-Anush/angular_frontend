import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerNavComponent } from './customer-nav-component';

describe('CustomerNavComponent', () => {
  let component: CustomerNavComponent;
  let fixture: ComponentFixture<CustomerNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerNavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
