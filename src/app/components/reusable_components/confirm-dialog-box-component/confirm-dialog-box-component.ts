import { CommonModule } from '@angular/common';

import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogBoxDataModel } from '../../../models/ui_models/confirmDialogBoxDataModel';

@Component({
  selector: 'app-confirm-dialog-box-component',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  templateUrl: './confirm-dialog-box-component.html',
  styleUrl: './confirm-dialog-box-component.scss',
})
export class ConfirmDialogBoxComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogBoxDataModel
  ) { }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
