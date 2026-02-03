import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowReceiptDialogBoxComponent } from './cashflow-receipt-dialog-box-component';

describe('CashflowReceiptDialogBoxComponent', () => {
  let component: CashflowReceiptDialogBoxComponent;
  let fixture: ComponentFixture<CashflowReceiptDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashflowReceiptDialogBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashflowReceiptDialogBoxComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
