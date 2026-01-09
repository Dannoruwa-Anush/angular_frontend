import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { InvoiceStatusEnum } from '../../../config/enums/invoiceStatusEnum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceReadModel } from '../../../models/api_models/read_models/invoiceReadModel';
import { FileService } from '../../../services/ui_service/fileService';

export interface InvoiceViewDialogData {
  invoice: InvoiceReadModel;
}

@Component({
  selector: 'app-invoice-view-dialog-box-component',
  imports: [
    CommonModule,
    MaterialModule,
    NgxExtendedPdfViewerModule
  ],
  templateUrl: './invoice-view-dialog-box-component.html',
  styleUrl: './invoice-view-dialog-box-component.scss',
})
export class InvoiceViewDialogBoxComponent {

  InvoiceStatusEnum = InvoiceStatusEnum;
  invoiceFileUrl: string;

  constructor(
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: InvoiceViewDialogData,
    private dialogRef: MatDialogRef<InvoiceViewDialogBoxComponent>
  ) {
    // Get full URL for the invoice PDF
    this.invoiceFileUrl = this.fileService.getInvoiceFileUrl(data.invoice);
  }

  get isUnpaid(): boolean {
    return this.data.invoice.invoiceStatus === InvoiceStatusEnum.Unpaid;
  }

  pay(): void {
    this.dialogRef.close({ action: 'pay', invoice: this.data.invoice });
  }

  cancelInvoice(): void {
    this.dialogRef.close({ action: 'cancel', invoice: this.data.invoice });
  }

  close(): void {
    this.dialogRef.close();
  }
}
