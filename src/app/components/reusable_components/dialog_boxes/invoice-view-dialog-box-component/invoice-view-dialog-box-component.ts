import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceReadModel } from '../../../../models/api_models/read_models/invoiceReadModel';
import { SafeUrlPipe } from '../../../../pipes/safeUrlPipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SystemOperationConfirmService } from '../../../../services/ui_service/systemOperationConfirmService';
import { SystemMessageService } from '../../../../services/ui_service/systemMessageService';
import { PaymentService } from '../../../../services/api_services/paymentService';
import { PaymentCreateModel } from '../../../../models/api_models/create_update_models/create_models/payment_create_Model';

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

   mode = signal<DialogMode>('VIEW');
  loading = signal(true);
  saving = signal(false);
  paymentMethod = signal<PaymentMethod>('CASH');

  form!: FormGroup;

  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InvoiceViewDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoice: InvoiceReadModel },
    private confirmService: SystemOperationConfirmService,
    private messageService: SystemMessageService
  ) {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardHolderName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      cardExpiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cardCvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  onPay(): void {
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

      if (!confirmed) {
        return;
      }

      const payload: PaymentCreateModel = {
        invoiceId: this.data.invoice.invoiceID
      };

      this.saving.set(true);

      this.paymentService.create(payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.messageService.success('Payment saved successfully');

          this.dialogRef.close({
            action: 'paid',
            invoice: this.data.invoice,
            paymentMethod: this.paymentMethod()
          });
        },
        error: err => {
          this.saving.set(false);
          this.messageService.error(err?.error?.message || 'Payment failed');
        }
      });

    });
  }

  onClose(): void {
    if (this.saving()) {
      return;
    }
    this.dialogRef.close();
  }

  onLoad(): void {
    this.loading.set(false);
  }
}
