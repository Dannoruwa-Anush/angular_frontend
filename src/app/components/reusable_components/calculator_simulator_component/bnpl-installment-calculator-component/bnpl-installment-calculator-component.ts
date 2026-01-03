import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { ShoppingCartService } from '../../../../services/ui_service/shoppingCartService';

@Component({
  selector: 'app-bnpl-installment-calculator-component',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './bnpl-installment-calculator-component.html',
  styleUrl: './bnpl-installment-calculator-component.scss',
})
export class BnplInstallmentCalculatorComponent {
  total!: Signal<number>;

  planType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' = 'MONTHLY';
  initialPayment = 0;
  installmentCount = 3;

  remainingAmount = 0;
  installmentAmount = 0;
  calculated = false;

  constructor(private cartService: ShoppingCartService) {
    this.total = this.cartService.cartTotal;
  }

  calculate() {
    const totalAmount = this.total();

    if (this.initialPayment >= totalAmount) {
      this.remainingAmount = 0;
      this.installmentAmount = 0;
      this.calculated = true;
      return;
    }

    this.remainingAmount = totalAmount - this.initialPayment;
    this.installmentAmount = this.remainingAmount / this.installmentCount;
    this.calculated = true;
  }

  finalizePlan() {
    const plan = {
      planType: this.planType,
      initialPayment: this.initialPayment,
      installmentCount: this.installmentCount,
      installmentAmount: this.installmentAmount,
    };

    console.log('Finalized BNPL Plan', plan);

    // 🔐 send to backend
    // 🚀 navigate to success page
  }
}
