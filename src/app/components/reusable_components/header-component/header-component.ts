import { Component, Signal } from '@angular/core';

import { MaterialModule } from '../../../custom_modules/material/material-module';
import { RouterModule } from '@angular/router';
import { ShoppingCartService } from '../../../services/ui_service/shoppingCartService';

@Component({
  selector: 'app-header-component',
  imports: [
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
    private shoppingCartService: ShoppingCartService
  ){
    this.cartItemCount = this.shoppingCartService.cartItemCount;
  }
}
