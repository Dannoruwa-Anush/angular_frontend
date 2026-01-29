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
import { InvoiceService } from '../../../../services/api_services/invoiceService';
import { InvoiceTypeEnum } from '../../../../config/enums/invoiceTypeEnum';

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

  // ================= Expose enum to template ===========
  InvoiceStatusEnum = InvoiceStatusEnum;
  InvoiceTypeEnum = InvoiceTypeEnum;

  // ================= STATE =================
  invoice = signal<InvoiceReadModel | null>(null);
  mode = signal<DialogMode>('VIEW');
  loading = signal(true);
  saving = signal(false);
  paymentMethod = signal<PaymentMethod>('CARD');

  form!: FormGroup;

  // ================= ROLE CHECKS =================
  isCustomer = computed(
    () => this.auth.role() === UserRoleEnum.Customer
  );

  isCashier = computed(
    () => this.auth.employeePosition() === EmployeePositionEnum.Cashier
  );

  isManger = computed(
    () => this.auth.employeePosition() === EmployeePositionEnum.Manager
  );

  canShowPay = computed(
    () => this.isCustomer() || this.isCashier()
  );

  canShowCancel = computed(
    () => this.isManger() && 
          this.invoice()?.invoiceType === InvoiceTypeEnum.Bnpl_Installment_Pay &&
          this.invoice()?.invoiceStatus === InvoiceStatusEnum.Unpaid
  );

  // ================= URLS =================
  invoiceUrl = computed(
    () => this.invoice()?.invoiceFileUrl ?? null
  );

  receiptUrl = computed(
    () => this.invoice()?.receiptFileUrl ?? null
  );

  // ================= DISPLAY =================
  showReceipt = computed(
    () =>
      this.invoice()?.invoiceStatus === InvoiceStatusEnum.Paid &&
      !!this.receiptUrl()
  );

  showInvoice = computed(
    () => !!this.invoice() && !this.showReceipt()
  );

  pdfUrl = computed(
    () => this.showReceipt() ? this.receiptUrl() : this.invoiceUrl()
  );

  constructor(
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private auth: AuthSessionService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InvoiceViewDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) data: { invoice: InvoiceReadModel },
    private confirmService: SystemOperationConfirmService,
    private messageService: SystemMessageService
  ) {
    this.invoice.set(data.invoice);
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

      const invoiceId = this.invoice()!.invoiceID;

      const payload: PaymentCreateModel = {
        invoiceId
      };

      this.saving.set(true);

      this.paymentService.create(payload).subscribe({
        next: () => this.refreshInvoice(invoiceId),
        error: err => {
          this.saving.set(false);
          this.messageService.error(
            err?.error?.message || 'Payment failed'
          );
        }
      });
    });
  }

  private refreshInvoice(invoiceId: number): void {
    this.loading.set(true);

    this.invoiceService.getById(invoiceId).subscribe({
      next: updatedInvoice => {
        this.invoice.set(updatedInvoice);
        this.mode.set('VIEW');
        this.loading.set(false);
        this.saving.set(false);
        this.messageService.success('Payment completed successfully');
      },
      error: () => {
        this.loading.set(false);
        this.saving.set(false);
        this.messageService.warning(
          'Payment completed, but invoice refresh failed'
        );
      }
    });
  }

  onCancelInvoice(): void {
    const invoiceId = this.invoice()!.invoiceID;

    this.confirmService.confirm({
      title: 'Cancel Invoice',
      message: 'Are you sure you want to cancel this invoice?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe(confirmed => {
      if (!confirmed) return;

      this.saving.set(true);

      this.invoiceService.cancelInvoice(invoiceId).subscribe({
        next: updatedInvoice => {
          this.invoice.set(updatedInvoice);
          this.saving.set(false);
          this.mode.set('VIEW');
        },
        error: () => {
          this.saving.set(false);
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
