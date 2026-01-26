import { CommonModule } from '@angular/common';
import { Component, computed, Inject, signal } from '@angular/core';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceReadModel } from '../../../../models/api_models/read_models/invoiceReadModel';
import { SafeUrlPipe } from '../../../../pipes/safeUrlPipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SystemOperationConfirmService } from '../../../../services/ui_service/systemOperationConfirmService';
import { SystemMessageService } from '../../../../services/ui_service/systemMessageService';
import { PaymentService } from '../../../../services/api_services/paymentService';
import { PaymentCreateModel } from '../../../../models/api_models/create_update_models/create_models/payment_create_Model';
import { AuthSessionService } from '../../../../services/auth_services/authSessionService';
import { UserRoleEnum } from '../../../../config/enums/userRoleEnum';
import { EmployeePositionEnum } from '../../../../config/enums/employeePositionEnum';
import { InvoiceStatusEnum } from '../../../../config/enums/invoiceStatusEnum';

type DialogMode = 'VIEW' | 'PAY';
type PaymentMethod = 'CASH' | 'CARD';

@Component({
  selector: 'app-invoice-view-dialog-box-component',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SafeUrlPipe,
  ],
  templateUrl: './invoice-view-dialog-box-component.html',
  styleUrl: './invoice-view-dialog-box-component.scss',
})
export class InvoiceViewDialogBoxComponent {


  // expose enum to template
  InvoiceStatusEnum = InvoiceStatusEnum;

  // ================= STATE =================
  mode = signal<DialogMode>('VIEW');
  loading = signal(true);
  saving = signal(false);
  paymentMethod = signal<PaymentMethod>('CARD');

  form!: FormGroup;

  // ================= DERIVED STATE =================
  showReceipt = computed(
    () => this.data.invoice.invoiceStatus === InvoiceStatusEnum.Paid
  );

  showInvoice = computed(
    () => this.data.invoice.invoiceStatus !== InvoiceStatusEnum.Paid
  );

  // ================= ROLE CHECKS =================
  isCustomer = computed(
    () => this.auth.role() === UserRoleEnum.Customer
  );

  isCashier = computed(
    () => this.auth.employeePosition() === EmployeePositionEnum.Cashier
  );

  canShowPay = computed(
    () => this.isCustomer() || this.isCashier()
  );

  invoiceUrl = computed(() => {
    const url = this.data.invoice.invoiceFileUrl;
    return url ? url : null;
  });

  receiptUrl = computed(() => {
    const url = this.data.invoice.receiptFileUrl;
    return url ? url : null;
  });

  constructor(
    private paymentService: PaymentService,
    private auth: AuthSessionService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InvoiceViewDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoice: InvoiceReadModel },
    private confirmService: SystemOperationConfirmService,
    private messageService: SystemMessageService
  ) {
    this.buildForm();
  }

  // ================= FORM =================
  private buildForm(): void {
    this.form = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardHolderName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      cardExpiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cardCvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  // ================= ACTIONS =================
  onPay(): void {
    if (!this.canShowPay()) return;

    // customers are forced to CARD
    if (!this.isCashier()) {
      this.paymentMethod.set('CARD');
    }

    this.mode.set('PAY');
  }

  confirmPayment(): void {
    if (this.paymentMethod() === 'CARD' && this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.confirmService.confirm({
      title: 'Process Payment',
      message: 'Are you sure you want to continue this payment?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe(confirmed => {

      if (!confirmed) return;

      const payload: PaymentCreateModel = {
        invoiceId: this.data.invoice.invoiceID
      };

      this.saving.set(true);

      this.paymentService.create(payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.messageService.success('Payment completed successfully');

          this.dialogRef.close({
            action: 'paid',
            invoiceId: this.data.invoice.invoiceID,
            paymentMethod: this.paymentMethod()
          });
        },
        error: err => {
          this.saving.set(false);
          this.messageService.error(
            err?.error?.message || 'Payment failed'
          );
        }
      });
    });
  }

  onLoad(): void {
    this.loading.set(false);
  }

  onClose(): void {
    if (this.saving()) return;
    this.dialogRef.close();
  }
}
