import { Component, effect, Signal } from '@angular/core';

import { MaterialModule } from '../../../custom_modules/material/material-module';
import { RouterModule } from '@angular/router';
import { ShoppingCartService } from '../../../services/ui_service/shoppingCartService';
import { AuthSessionService } from '../../../services/auth_services/authSessionService';
import { CommonModule } from '@angular/common';
import { SystemOperationConfirmService } from '../../../services/ui_service/systemOperationConfirmService';

@Component({
  selector: 'app-header-component',
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {


  image_company_logo = 'assets/images/logo/logo.png';

  cartItemCount!: Signal<number>;

  constructor(
    private shoppingCartService: ShoppingCartService,
    public authSessionService: AuthSessionService,
    private confirmService: SystemOperationConfirmService
  ) {
    this.cartItemCount = this.shoppingCartService.cartItemCount;

    // LOGOUT : Process After Confirmation (effect() in constructor lives with component)
    effect(() => {
      const confirmed = this.confirmService.confirmed();

      if (confirmed === true) {
        this.authSessionService.logout();
        this.confirmService.clear();
      }
    });
  }

  // LOGOUT : Get Confirmation
  logout() {
    this.confirmService.confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout'
    });
  }
}
