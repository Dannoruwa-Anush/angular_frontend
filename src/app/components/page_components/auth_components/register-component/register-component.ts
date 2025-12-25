import { Component, computed, Signal, signal, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { AuthSessionService } from '../../../../services/auth_services/authSessionService';
import { UserRoleEnum } from '../../../../config/enums/userRoleEnum';
import { RegisterRequestModel } from '../../../../models/api_models/core_api_models/auth_models/request_models/registerRequestModel';
import { CommonModule } from '@angular/common';
import { SystemMessageService } from '../../../../services/ui_service/systemMessageService';

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
    private messageService: SystemMessageService,
    private fb: FormBuilder
  ) {
    this.buildForm();
    this.loading = this.authSessionService.loading;
  }

  // ===============================
  // FORM SETUP
  // ===============================
  private buildForm(): void {
    this.form = this.fb.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],
        password: [
          '',
          [
            Validators.required,
          ]
        ],
        confirmPassword: [
          '',
          Validators.required
        ],
        role: [
          UserRoleEnum.Customer, // default role
          Validators.required
        ]
      },
      {
        validators: this.passwordsMatchValidator
      }
    );
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    if (!confirm) return null; // required validation handled separately

    return password === confirm ? null : { passwordsMismatch: true };
  }

  // ===============================
  // GETTERS
  // ===============================
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
    const payload: RegisterRequestModel = {
      email: this.form.value.email,
      password: this.form.value.password,
      role: this.form.value.role as UserRoleEnum
    };

    this.authSessionService.register(payload).subscribe({
      next: () => {
        this.resetForm();
        this.messageService.success('Account created successfully');
      },
      error: (err) => {
        const msg = err?.error?.message || 'Registration failed';
        this.messageService.error(msg);
      }
    });
  }
}
