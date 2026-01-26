import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceReadModel } from '../../../../models/api_models/read_models/invoiceReadModel';
import { SafeUrlPipe } from '../../../../pipes/safeUrlPipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SystemOperationConfirmService } from '../../../../services/ui_service/systemOperationConfirmService';
import { SystemMessageService } from '../../../../services/ui_service/systemMessageService';

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
  paymentMethod = signal<PaymentMethod>('CASH');

  form!: FormGroup;

  constructor(
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

  get cardNumberCtrl() {
    return this.form.get('cardNumber')!;
  }

  get cardHolderNameCtrl() {
    return this.form.get('cardHolderName')!;
  }

  get cardExpiryCtrl() {
    return this.form.get('cardExpiry')!;
  }

  get cardCvvCtrl() {
    return this.form.get('cardCvv')!;
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

      const paymentPayload =
        this.paymentMethod() === 'CASH'
          ? { method: 'CASH' }
          : { method: 'CARD', ...this.form.value };

      this.messageService.info('Payment processed successfully');

      this.dialogRef.close({
        action: 'paid',
        invoice: this.data.invoice,
        payment: paymentPayload
      });

    });
  }

  onCancelInvoice(): void {
    this.dialogRef.close({
      action: 'cancel',
      invoice: this.data.invoice
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onLoad(): void {
    this.loading.set(false);
  }
}
