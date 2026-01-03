import { CommonModule } from '@angular/common';
import { Component, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../custom_modules/material/material-module';

@Component({
  selector: 'app-bnpl-installment-payment-simulator-component',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './bnpl-installment-payment-simulator-component.html',
  styleUrl: './bnpl-installment-payment-simulator-component.scss',
})
export class BnplInstallmentPaymentSimulatorComponent {


  
  /* -----------------------------
   ORDER & PLAN INFO
  ------------------------------ */

  orderId = 102345;
  planType = 'Monthly';
  interestRate = 12; // %

  totalAmount = 120000;

  /* -----------------------------
   CART ITEMS (FOR SUMMARY)
  ------------------------------ */

  cartItems: Signal<any[]> = signal([
    {
      productId: 1,
      name: 'Laptop Pro 15"',
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/60',
      subtotal: 85000
    },
    {
      productId: 2,
      name: 'Wireless Mouse',
      quantity: 2,
      imageUrl: 'https://via.placeholder.com/60',
      subtotal: 5000
    },
    {
      productId: 3,
      name: 'Laptop Backpack',
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/60',
      subtotal: 3000
    }
  ]);

  /* -----------------------------
   INSTALLMENT BREAKDOWN
  ------------------------------ */

  installmentColumns = ['no', 'dueDate', 'base', 'total', 'status'];

  installments = [
    {
      installmentNo: 1,
      installment_DueDate: new Date('2026-01-10'),
      installment_BaseAmount: 30000,
      totalDueAmount: 33600
    },
    {
      installmentNo: 2,
      installment_DueDate: new Date('2026-02-10'),
      installment_BaseAmount: 30000,
      totalDueAmount: 33600
    },
    {
      installmentNo: 3,
      installment_DueDate: new Date('2026-03-10'),
      installment_BaseAmount: 30000,
      totalDueAmount: 33600
    },
    {
      installmentNo: 4,
      installment_DueDate: new Date('2026-04-10'),
      installment_BaseAmount: 30000,
      totalDueAmount: 33600
    }
  ];

  /* -----------------------------
   SETTLEMENT SUMMARY (CURRENT)
  ------------------------------ */

  settlement = {
    currentInstallmentNo: 1,
    notYetDueCurrentInstallmentBaseAmount: 30000,
    total_LateInterest: 0,
    total_PayableSettlement: 30000
  };

  /* -----------------------------
   PAYMENT SIMULATOR
  ------------------------------ */

  paymentAmount = 0;

  simulationResult: any = null;

  simulatePayment() {
    if (!this.paymentAmount || this.paymentAmount <= 0) {
      this.simulationResult = null;
      return;
    }

    const paidToInterest = Math.min(this.paymentAmount * 0.1, 2000);
    const paidToBase = this.paymentAmount - paidToInterest;

    this.simulationResult = {
      paidToBase,
      paidToInterest,
      remainingBalance: Math.max(
        this.settlement.total_PayableSettlement - paidToBase,
        0
      ),
      resultStatus:
        paidToBase >= this.settlement.total_PayableSettlement
          ? 'INSTALLMENT_SETTLED'
          : 'PARTIAL_PAYMENT'
    };
  }

  /* -----------------------------
   CONFIRM PAYMENT
  ------------------------------ */

  paymentResult: any = null;

  confirmPayment() {
    if (!this.simulationResult) return;

    this.paymentResult = {
      appliedToBase: this.simulationResult.paidToBase,
      appliedToInterest: this.simulationResult.paidToInterest,
      overPayment:
        this.simulationResult.paidToBase >
        this.settlement.total_PayableSettlement
          ? this.simulationResult.paidToBase -
            this.settlement.total_PayableSettlement
          : 0,
      newStatus:
        this.simulationResult.resultStatus === 'INSTALLMENT_SETTLED'
          ? 'NEXT_INSTALLMENT_PENDING'
          : 'PARTIALLY_PAID'
    };

    // Reset simulator
    this.paymentAmount = 0;
  }
}
