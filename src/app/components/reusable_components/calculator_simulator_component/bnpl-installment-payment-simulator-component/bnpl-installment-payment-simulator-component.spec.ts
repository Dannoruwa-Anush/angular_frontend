import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplInstallmentPaymentSimulatorComponent } from './bnpl-installment-payment-simulator-component';

describe('BnplInstallmentPaymentSimulatorComponent', () => {
  let component: BnplInstallmentPaymentSimulatorComponent;
  let fixture: ComponentFixture<BnplInstallmentPaymentSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BnplInstallmentPaymentSimulatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BnplInstallmentPaymentSimulatorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
