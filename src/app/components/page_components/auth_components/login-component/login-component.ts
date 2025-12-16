import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal, Signal, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { AuthSessionService } from '../../../../services/auth_services/authSessionService';
import { LoginRequestModel } from '../../../../models/api_models/core_api_models/auth_models/request_models/loginRequestModel';
import { SystemMessageService } from '../../../../services/ui_service/systemMessageService';
import { SystemMessageModel } from '../../../../models/ui_models/systemMessageModel';

@Component({
  selector: 'app-login-component',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {


  // ---------- FORM ----------
  email = signal('');
  password = signal('');

  // ---------- UI STATE ----------
  loading!: Signal<boolean>;
  message!: Signal<SystemMessageModel | null>;

  // ---------- VALIDATION ----------
  isFormValid = computed(() => {
    const email = this.email();
    const password = this.password();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && password.length > 0;
  });

  constructor(
    private authSessionService: AuthSessionService,
    public messageService: SystemMessageService
  ) {
    this.loading = this.authSessionService.loading;
    this.message = this.messageService.message;

    // clear form after success
    effect(() => {
      const msg = this.message();
      if (msg?.type === 'success') {
        this.clearForm();
      }
    });
  }

  login(): void {
    if (!this.isFormValid()) return;

    const payload: LoginRequestModel = {
      email: this.email(),
      password: this.password()
    };

    this.authSessionService.login(payload).subscribe();
  }

  private clearForm() {
    this.email.set('');
    this.password.set('');
  }
}
