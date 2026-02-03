import { CommonModule } from '@angular/common';
import { Component, computed, Inject, signal } from '@angular/core';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { SafeUrlPipe } from '../../../../pipes/safeUrlPipe';
import { CashflowReadModel } from '../../../../models/api_models/read_models/cashflow_read_model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileService } from '../../../../services/ui_service/fileService';

@Component({
  selector: 'app-cashflow-receipt-dialog-box-component',
  imports: [
    CommonModule,
    MaterialModule,
    SafeUrlPipe,
  ],
  templateUrl: './cashflow-receipt-dialog-box-component.html',
  styleUrl: './cashflow-receipt-dialog-box-component.scss',
})
export class CashflowReceiptDialogBoxComponent {

  // ================= STATE =================
  cashflow = signal<CashflowReadModel | null>(null);
  loading = signal(true);
  saving = signal(false);

  // ================= PDF =================
    pdfUrl = computed(() => {
    const cf = this.cashflow();
    const url = cf ? this.fileService.getCashflowReceiptFileUrl(cf) : '';

    if (!url) {
      this.loading.set(false);
    }

    return url;
  });

  hasPdf = computed(() => !!this.pdfUrl());

  constructor(
    private dialogRef: MatDialogRef<CashflowReceiptDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) data: { cashflow: CashflowReadModel },
    private fileService: FileService
  ) {
    this.cashflow.set(data.cashflow);
  }

  onLoad(): void {
    this.loading.set(false);
  }

  onClose(): void {
    if (this.saving()) return;
    this.dialogRef.close();
  }
}
