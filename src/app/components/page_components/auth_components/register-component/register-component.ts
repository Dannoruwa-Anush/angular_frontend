import { Component, computed, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {



  // ---------- FORM ----------
  email = signal('');
  password = signal('');
  confirmPassword = signal('');

  // ---------- UI STATE ----------
  loading!: WritableSignal<boolean>;
  error!: WritableSignal<string | null>;

  // ---------- VALIDATION ----------
  isFormValid = computed(() => {
    const email = this.email();
    const password = this.password();
    const confirm = this.confirmPassword();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      emailRegex.test(email) &&
      password.length >= 6 &&
      password === confirm
    );
  });

  constructor(
    private authSessionService: AuthSessionService,
    public messageService: SystemMessageService
  ) { 
    this.loading = this.authSessionService.loading;
    this.error = this.authSessionService.error;
  }

  register(): void {
    if (!this.isFormValid()) return;

    const payload: RegisterRequestModel = {
      email: this.email(),
      password: this.password(),
      role: UserRoleEnum.Customer
    };

    this.authSessionService.register(payload).subscribe();
  }
}
