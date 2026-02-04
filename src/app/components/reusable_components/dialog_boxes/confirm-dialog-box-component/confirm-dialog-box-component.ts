import { CommonModule } from '@angular/common';

import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogBoxDataModel } from '../../../../models/ui_models/confirmDialogBoxDataModel';

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

  inputValue = '';
  radioValue: any;

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogBoxDataModel
  ) { }

  // ===============================
  // GETTERS
  // ===============================
  get title(): string {
    return this.data.title ?? 'Confirm';
  }

  get confirmText(): string {
    return this.data.confirmText ?? 'Confirm';
  }

  get cancelText(): string {
    return this.data.cancelText ?? 'Cancel';
  }

  get hasInput(): boolean {
    return !!this.data.inputConfig;
  }

  get inputPlaceholder(): string {
    return this.data.inputConfig?.placeholder ?? '';
  }

  get inputRequired(): boolean {
    return this.data.inputConfig?.required ?? false;
  }

  get inputType(): 'text' | 'password' {
    return this.data.inputConfig?.type ?? 'text';
  }

  get hasRadio(): boolean {
    return !!this.data.radioConfig;
  }

  get radioOptions() {
    return this.data.radioConfig?.options ?? [];
  }

  get radioRequired(): boolean {
    return this.data.radioConfig?.required ?? false;
  }

  get shouldShowInput(): boolean {
    if (!this.data.inputConfig) return false;

    const trigger = this.data.inputConfig.showWhenRadioValue;
    if (trigger === undefined) return true;

    return this.radioValue === trigger;
  }

  get isInputRequired(): boolean {
    if (!this.data.inputConfig?.required) return false;

    const trigger = this.data.inputConfig.showWhenRadioValue;
    if (trigger === undefined) return true;

    return this.radioValue === trigger;
  }

  get isConfirmDisabled(): boolean {
    if (this.radioRequired && this.radioValue == null) return true;
    if (this.isInputRequired && !this.inputValue?.trim()) return true;
    return false;
  }

  // ======================================================
  // OPERATIONS
  // ======================================================
  confirm(): void {
    this.dialogRef.close({
      confirmed: true,
      value: this.radioValue,
      inputValue: this.inputValue?.trim()
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
