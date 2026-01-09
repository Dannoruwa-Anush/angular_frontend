import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { BnplPlanInstallmentCalculatorCreateModel } from '../../../models/api_models/create_update_models/create_models/bnplInstallmentCalculator_create_Model';
import { SystemMessageService } from '../../../services/ui_service/systemMessageService';

@Component({
  selector: 'app-bnpl-plan-installment-calculator-dialog-box-component',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './bnpl-plan-installment-calculator-dialog-box-component.html',
  styleUrl: './bnpl-plan-installment-calculator-dialog-box-component.scss',
})
export class BnplPlanInstallmentCalculatorDialogBoxComponent {
  loading = signal(false);
  calculationResult = signal<any | null>(null);

  // ======================================================
  // FORM
  // ======================================================
  form!: FormGroup;



  constructor(
    private fb: FormBuilder,
    private messageService: SystemMessageService,
    private dialogRef: MatDialogRef<BnplPlanInstallmentCalculatorDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      total: number;
      plan?: any;
    }
  ) {
    this.buildForm();
    if (data.plan) {
      this.form.patchValue(data.plan);
      this.calculationResult.set(data.plan);
    }
  }

  // ======================================================
  // REACTIVE FORM SETUP
  // ======================================================
  private buildForm(): void {
    this.form = this.fb.group({
      bnpl_PlanTypeID: [null, Validators.required],
      installmentCount: [3, [Validators.required, Validators.min(2)]],
      initialPayment: [0, [Validators.required, Validators.min(0)]],
    });
  }
  // -----------------------
  // SUBMIT FOR CALCULATION
  // -----------------------
  calculate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: BnplPlanInstallmentCalculatorCreateModel = {
      totalOrderAmount: this.data.total,
      bnpl_PlanTypeID: this.form.value.bnpl_PlanTypeID!,
      installmentCount: this.form.value.installmentCount!,
      initialPayment: this.form.value.initialPayment!,
    };

    this.loading.set(true);

    // 🔁 BACKEND CALL PLACEHOLDER
    // Replace with your real API service
    setTimeout(() => {
      this.loading.set(false);

      // Simulated backend response
      const result = {
        ...payload,
        installmentAmount:
          (payload.totalOrderAmount - payload.initialPayment) /
          payload.installmentCount,
        planType: `Plan ${payload.bnpl_PlanTypeID}`
      };

      this.calculationResult.set(result);
    }, 800);
  }


  // -----------------------
  // CONFIRM SELECTION
  // -----------------------
  confirm() {
    if (!this.calculationResult()) return;
    this.dialogRef.close(this.calculationResult());
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
