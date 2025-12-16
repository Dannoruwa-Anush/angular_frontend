import { Component, Signal } from '@angular/core';

import { MaterialModule } from '../../../custom_modules/material/material-module';
import { RouterModule } from '@angular/router';
import { ShoppingCartService } from '../../../services/ui_service/shoppingCartService';
import { AuthSessionService } from '../../../services/auth_services/authSessionService';
import { CommonModule } from '@angular/common';

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
  ){
    this.cartItemCount = this.shoppingCartService.cartItemCount;
  }

  logout() {
    this.authSessionService.logout();
  }
}
