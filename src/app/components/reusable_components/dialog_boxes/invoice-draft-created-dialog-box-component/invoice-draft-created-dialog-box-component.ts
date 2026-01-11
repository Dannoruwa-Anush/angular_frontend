import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-draft-created-dialog-box-component',
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './invoice-draft-created-dialog-box-component.html',
  styleUrl: './invoice-draft-created-dialog-box-component.scss',
})
export class InvoiceDraftCreatedDialogBoxComponent {




  constructor(
    private dialogRef: MatDialogRef<InvoiceDraftCreatedDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      orderId?: number;
      totalAmount?: number;
      invoiceId: number;
    }
  ) { }

  cancel(): void {
    this.dialogRef.close(null);
  }

  reviewInvoice(): void {
    this.dialogRef.close({
      action: 'review',
      invoiceId: this.data.invoiceId
    });
  }
}