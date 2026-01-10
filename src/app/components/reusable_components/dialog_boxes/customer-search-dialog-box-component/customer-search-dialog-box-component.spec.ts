import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSearchDialogBoxComponent } from './customer-search-dialog-box-component';

describe('CustomerSearchDialogBoxComponent', () => {
  let component: CustomerSearchDialogBoxComponent;
  let fixture: ComponentFixture<CustomerSearchDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerSearchDialogBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSearchDialogBoxComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
