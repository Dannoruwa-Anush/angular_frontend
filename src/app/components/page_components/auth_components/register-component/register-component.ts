import { Component, Signal, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { AuthSessionService } from '../../../../services/auth_services/authSessionService';
import { UserRoleEnum } from '../../../../config/enums/userRoleEnum';
import { CommonModule } from '@angular/common';
import { SystemMessageService } from '../../../../services/ui_service/systemMessageService';
import { CustomerRegisterRequestModel } from '../../../../models/api_models/core_api_models/user_registration/customerRegisterRequestModel';
import { CustomerService } from '../../../../services/api_services/customerService';

@Component({
  selector: 'app-register-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {



  // ===============================
  // FORM
  // ===============================
  form!: FormGroup;
  submitted = false;

  @ViewChild(FormGroupDirective)
  private formDirective!: FormGroupDirective;

  // ===============================
  // UI STATE
  // ===============================
  loading!: Signal<boolean>;

  constructor(
    private authSessionService: AuthSessionService,
    private customerService: CustomerService,
    private messageService: SystemMessageService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.buildForm();
    this.loading = this.authSessionService.loading;
    this.loading = this.customerService.loading;
  }

  // ===============================
  // FORM SETUP
  // ===============================
  private buildForm(): void {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required]],
        phoneNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        address: ['', [Validators.required, Validators.maxLength(255)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        role: [UserRoleEnum.Customer, Validators.required]
      },
      {
        validators: this.passwordsMatchValidator,
        updateOn: 'change' // important for real-time validation
      }
    );
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirm = group.get('confirmPassword');

    if (!confirm?.value) return null; // required handled separately

    const mismatch = password?.value !== confirm.value;

    if (mismatch) {
      confirm.setErrors({ ...confirm.errors, passwordsMismatch: true });
    } else {
      if (confirm.errors) {
        delete confirm.errors['passwordsMismatch'];
        if (!Object.keys(confirm.errors).length) confirm.setErrors(null);
      }
    }

    return mismatch ? { passwordsMismatch: true } : null;
  }

  // ===============================
  // GETTERS
  // ===============================
  get nameCtrl() {
    return this.form.get('name')!;
  }

  get phoneNoCtrl() {
    return this.form.get('phoneNo')!;
  }

  get addressCtrl() {
    return this.form.get('address')!;
  }

  get emailCtrl() {
    return this.form.get('email')!;
  }

  get passwordCtrl() {
    return this.form.get('password')!;
  }

  get confirmPasswordCtrl() {
    return this.form.get('confirmPassword')!;
  }

  // ===============================
  // SUBMIT
  // ===============================
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.register();
  }

  // ===============================
  // RESET
  // ===============================
  private resetForm(): void {
    this.submitted = false;
    this.formDirective.resetForm();
    this.form.enable();
  }

  // ===============================
  // REGISTER
  // ===============================
  register(): void {
    const payload: CustomerRegisterRequestModel = {
      customerName: this.form.value.name,
      phoneNo: this.form.value.phoneNo,
      address: this.form.value.address,

      user: {
        email: this.form.value.email,
        password: this.form.value.password,
        role: this.form.value.role as UserRoleEnum
      }
    };

    console.log(payload);

    //customer service
    this.customerService.create(payload).subscribe({
      next: () => {
        this.resetForm();
        this.messageService.success('Account created successfully');

        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Registration failed';
        this.messageService.error(msg);
      }
    });
  }
}
