import { CommonModule } from '@angular/common';
import { Component, computed, Inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { BnplPlanInstallmentCalculatorCreateModel } from '../../../models/api_models/create_update_models/create_models/bnplInstallmentCalculator_create_Model';
import { SystemMessageService } from '../../../services/ui_service/systemMessageService';
import { BnplPlanTypeReadModel } from '../../../models/api_models/read_models/bnplPlanType_read_Model';
import { BnplPlanTypeService } from '../../../services/api_services/bnplPlanTypeService';
import { CrudOperationConfirmationUiHelper } from '../../../utils/crudOperationConfirmationUiHelper';
import { SystemOperationConfirmService } from '../../../services/ui_service/systemOperationConfirmService';
import { BnplPlanService } from '../../../services/api_services/bnplPlanService';
import { BnplPlanInstallmentCalculatorReadModel } from '../../../models/api_models/read_models/bnplInstallmentCalculator_Read_Model';

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

  // ======================================================
  // DATA
  // ======================================================
  bnplPlanTypes = signal<BnplPlanTypeReadModel[]>([]);
  loading = signal(false);

  calculationResult = signal<BnplPlanInstallmentCalculatorReadModel | null>(null);

  reviewMode = computed(() => !!this.calculationResult());

  // ======================================================
  // FORM
  // ======================================================
  form!: FormGroup;
  submitted = false;

  @ViewChild(FormGroupDirective)
  private formDirective!: FormGroupDirective;

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private dialogRef: MatDialogRef<BnplPlanInstallmentCalculatorDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { total: number; plan?: any },

    private bnplPlanTypeService: BnplPlanTypeService,
    private bnplPlanService: BnplPlanService,
    private messageService: SystemMessageService,
    private confirmService: SystemOperationConfirmService,
    private fb: FormBuilder
  ) {
    this.buildForm();
    this.loadBnplPlanTypes();
  }

  // ======================================================
  // INIT DATA
  // ======================================================
  private loadBnplPlanTypes(): void {
    this.bnplPlanTypeService.getAll().subscribe(res => {
      this.bnplPlanTypes.set(res);
    });
  }

  // ======================================================
  // FORM SETUP
  // ======================================================
  private buildForm(): void {
    this.form = this.fb.group({
      bnpl_PlanTypeID: [null, Validators.required],
      installmentCount: [3, [Validators.required, Validators.min(2)]],
      initialPayment: [0, [Validators.required, Validators.min(0)]],
    });
  }

  // ======================================================
  // SUBMIT
  // ======================================================
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.calculate();
  }

  // ======================================================
  // CALCULATE
  // ======================================================
  calculate(): void {
    const payload: BnplPlanInstallmentCalculatorCreateModel = {
      totalOrderAmount: this.data.total,
      bnpl_PlanTypeID: this.form.value.bnpl_PlanTypeID!,
      installmentCount: this.form.value.installmentCount!,
      initialPayment: this.form.value.initialPayment!,
    };

    this.loading.set(true);

    this.bnplPlanService.calculateBnplPlanInstallment(payload).subscribe({
      next: (result) => {
        this.loading.set(false);
        this.calculationResult.set(result);
        this.form.disable();
        this.messageService.success('BNPL installment calculated successfully');
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message || 'BNPL installment calculation failed';
        this.messageService.error(msg);
      }
    });
  }

  // ======================================================
  // EDIT
  // ======================================================
  edit(): void {
    this.calculationResult.set(null);
    this.form.enable();
  }

  // ======================================================
  // CONFIRM
  // ======================================================
  confirm(): void {
    if (!this.calculationResult()) return;

    this.confirmService.confirm({
      title: 'Confirm BNPL Plan',
      message: 'Do you want to use this installment plan?',
      confirmText: 'Use Plan',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (!confirmed) return;

      this.dialogRef.close({
        ...this.form.getRawValue(),
        ...this.calculationResult()
      });
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
