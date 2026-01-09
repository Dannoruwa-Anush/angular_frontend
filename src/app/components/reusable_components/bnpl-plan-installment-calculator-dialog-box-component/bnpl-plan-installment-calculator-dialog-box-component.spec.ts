import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplPlanInstallmentCalculatorDialogBoxComponent } from './bnpl-plan-installment-calculator-dialog-box-component';

describe('BnplPlanInstallmentCalculatorDialogBoxComponent', () => {
  let component: BnplPlanInstallmentCalculatorDialogBoxComponent;
  let fixture: ComponentFixture<BnplPlanInstallmentCalculatorDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BnplPlanInstallmentCalculatorDialogBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BnplPlanInstallmentCalculatorDialogBoxComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
