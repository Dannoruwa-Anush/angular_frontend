import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { CustomerReadModel } from '../../../../models/api_models/read_models/customer_read_Model';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../../../services/api_services/customerService';

@Component({
  selector: 'app-customer-search-dialog-box-component',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './customer-search-dialog-box-component.html',
  styleUrl: './customer-search-dialog-box-component.scss',
})
export class CustomerSearchDialogBoxComponent {



  // ======================================================
  // DATA
  // ======================================================
  loading = signal(false);
  result = signal<CustomerReadModel | null>(null);

  // ======================================================
  // FORM
  // ======================================================
  form!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CustomerSearchDialogBoxComponent>,
    private customerService: CustomerService
  ) { 

    this.buildForm();
  }

  // ======================================================
  // FORM SETUP
  // ======================================================
  private buildForm(): void {
    this.form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
    });
  }

  search(): void {
    if (this.form.invalid) return;

    this.loading.set(true);

    this.customerService.getByUser(this.form.value.email!).subscribe({
      next: customer => {
        this.result.set(customer);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  confirm(): void {
    if (!this.result()) return;
    this.dialogRef.close(this.result());
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
