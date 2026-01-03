import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplInstallmentCalculatorComponent } from './bnpl-installment-calculator-component';

describe('BnplInstallmentCalculatorComponent', () => {
  let component: BnplInstallmentCalculatorComponent;
  let fixture: ComponentFixture<BnplInstallmentCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BnplInstallmentCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BnplInstallmentCalculatorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
