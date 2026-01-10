import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
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
  searchResult = signal<CustomerReadModel | null>(null);

  reviewMode = computed(() => !!this.searchResult());

  // ======================================================
  // FORM
  // ======================================================
  form!: FormGroup;
  submitted = false;

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private dialogRef: MatDialogRef<CustomerSearchDialogBoxComponent>,
    private customerService: CustomerService,
    private fb: FormBuilder
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

  // ======================================================
  // SUBMIT
  // ======================================================
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.search();
  }

  // ======================================================
  // SEARCH CUSTOMER
  // ======================================================
  search(): void {
    const email = this.form.value.email!;
    this.loading.set(true);
    this.searchResult.set(null);

    this.customerService.getByUser(undefined, email).subscribe({
      next: customer => {
        this.loading.set(false);
        this.searchResult.set(customer);
        this.form.disable();
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  // ======================================================
  // EDIT
  // ======================================================
  edit(): void {
    this.searchResult.set(null);
    this.form.enable();
  }

  // ======================================================
  // CONFIRM
  // ======================================================
  confirm(): void {
    if (!this.searchResult()) return;

    this.dialogRef.close(this.searchResult());
  }

  // ======================================================
  // CANCEL
  // ======================================================
  cancel(): void {
    this.dialogRef.close(null);
  }
}
