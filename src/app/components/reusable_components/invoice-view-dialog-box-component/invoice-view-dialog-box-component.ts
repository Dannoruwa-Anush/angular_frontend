import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceReadModel } from '../../../models/api_models/read_models/invoiceReadModel';
import { SafeUrlPipe } from '../../../pipes/safeUrlPipe';

@Component({
  selector: 'app-invoice-view-dialog-box-component',
  imports: [
    CommonModule,
    MaterialModule,
    SafeUrlPipe, 
  ],
  templateUrl: './invoice-view-dialog-box-component.html',
  styleUrl: './invoice-view-dialog-box-component.scss',
})
export class InvoiceViewDialogBoxComponent {

  loading = true; // PDF loading flag

  constructor(
    public dialogRef: MatDialogRef<InvoiceViewDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoice: InvoiceReadModel }
  ) { }

  onPay() {
    this.dialogRef.close({ action: 'pay', invoice: this.data.invoice });
  }

  onCancelInvoice() {
    this.dialogRef.close({ action: 'cancel', invoice: this.data.invoice });
  }

  onClose() {
    this.dialogRef.close();
  }

  onLoad() {
    this.loading = false; // hide spinner when iframe loads
  }
}
