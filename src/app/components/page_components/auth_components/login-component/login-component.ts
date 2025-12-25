import { Component, computed, signal, Signal, ViewChild, } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { AuthSessionService } from '../../../../services/auth_services/authSessionService';
import { LoginRequestModel } from '../../../../models/api_models/core_api_models/auth_models/request_models/loginRequestModel';
import { SystemMessageService } from '../../../../services/ui_service/systemMessageService';

@Component({
  selector: 'app-login-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {


  // ===============================
  // FORM
  // ===============================
  form!: FormGroup;
  submitted = false;

  @ViewChild(FormGroupDirective)
  private formDirective!: FormGroupDirective;

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
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
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

  // ===============================
  // SUBMIT
  // ===============================
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.login();
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
  // LOGIN
  // ===============================
  private login(): void {
    const payload: LoginRequestModel = this.form.getRawValue();

    this.authSessionService.login(payload).subscribe({
      next: () => {
        this.resetForm();
        this.messageService.success('Logged in successfully');
      },
      error: err => {
        const msg = err?.error?.message || 'Login failed';
        this.messageService.error(msg);
      }
    });
  }
}
