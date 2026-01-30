import { Component, Signal } from '@angular/core';

import { MaterialModule } from '../../../custom_modules/material/material-module';
import { RouterModule } from '@angular/router';
import { ShoppingCartService } from '../../../services/ui_service/shoppingCartService';
import { AuthSessionService } from '../../../services/auth_services/authSessionService';
import { CommonModule } from '@angular/common';
import { SystemOperationConfirmService } from '../../../services/ui_service/systemOperationConfirmService';
import { SystemMessageService } from '../../../services/ui_service/systemMessageService';
import { UserRoleEnum } from '../../../config/enums/userRoleEnum';

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

  //expose enum
  UserRoleEnum = UserRoleEnum;
  
  image_company_logo = 'assets/images/logo/logo.png';

  cartItemCount!: Signal<number>;

  constructor(
    private shoppingCartService: ShoppingCartService,
    public authSessionService: AuthSessionService,
    private confirmService: SystemOperationConfirmService,
    private messageService: SystemMessageService
  ) {
    this.cartItemCount = this.shoppingCartService.cartItemCount;
  }

  // LOGOUT 
  logout() {
    this.confirmService.confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.authSessionService.logout();
        this.messageService.success('Logged out successfully');
      }
    });
  }
}
