import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { AuthSessionService } from '../../../../services/auth_services/authSessionService';
import { LoginRequestModel } from '../../../../models/api_models/core_api_models/auth_models/request_models/loginRequestModel';

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



  // ---------- STATE ----------
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  // ---------- VALIDATION ----------
  isFormValid = computed(() => {
    const email = this.email();
    const password = this.password();

    if (!email || !password) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  });

  constructor(
    private authSessionService: AuthSessionService
  ) { }

  // ---------- LOGIN ----------
  login(): void {
    if (!this.isFormValid()) {
      this.error.set('Please enter valid credentials');
      return;
    }

    const payload: LoginRequestModel = {
      email: this.email(),
      password: this.password()
    };

    this.loading.set(true);
    this.error.set(null);

    this.authSessionService.login(payload).subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.loading.set(false);
        this.error.set('Invalid email or password');
      }
    });
  }
}
