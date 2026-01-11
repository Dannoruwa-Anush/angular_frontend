import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplInstallmetPaymentSimulatorNavComponent } from './bnpl-installmet-payment-simulator-nav-component';

describe('BnplInstallmetPaymentSimulatorNavComponent', () => {
  let component: BnplInstallmetPaymentSimulatorNavComponent;
  let fixture: ComponentFixture<BnplInstallmetPaymentSimulatorNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BnplInstallmetPaymentSimulatorNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BnplInstallmetPaymentSimulatorNavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
