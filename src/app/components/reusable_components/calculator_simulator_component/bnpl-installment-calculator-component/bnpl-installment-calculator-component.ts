import { CommonModule } from '@angular/common';
import { Component, Inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { ShoppingCartService } from '../../../../services/ui_service/shoppingCartService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  planType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' = 'MONTHLY';
  initialPayment = 0;
  installmentCount = 3;

  remainingAmount = 0;
  installmentAmount = 0;
  calculated = false;

  constructor(
    private dialogRef: MatDialogRef<BnplInstallmentCalculatorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { total: number; plan?: any }
  ) {
    if (data.plan) {
      this.planType = data.plan.planType;
      this.initialPayment = data.plan.initialPayment;
      this.installmentCount = data.plan.installmentCount;
      this.installmentAmount = data.plan.installmentAmount;
      this.calculated = true;
    }
  }

  calculate() {
    const totalAmount = this.data.total;
    this.remainingAmount = totalAmount - this.initialPayment;
    this.installmentAmount = this.remainingAmount / this.installmentCount;
    this.calculated = true;
  }

  finalizePlan() {
    this.dialogRef.close({
      planType: this.planType,
      initialPayment: this.initialPayment,
      installmentCount: this.installmentCount,
      installmentAmount: this.installmentAmount,
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
