import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { ShoppingCartItemModel } from '../../../models/ui_models/shoppingCartItemModel';
import { ShoppingCartService } from '../../../services/ui_service/shoppingCartService';

@Component({
  selector: 'app-checkout-order-component',
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './checkout-order-component.html',
  styleUrl: './checkout-order-component.scss',
})
export class CheckoutOrderComponent {




  cartItems!: Signal<ShoppingCartItemModel[]>;
  total!: Signal<number>;

  paymentType: 'NOW' | 'LATER' = 'NOW';
  installmentPlan = 3;

  constructor(
    private cartService: ShoppingCartService,
    private router: Router,
  ) {
    this.cartItems = this.cartService.cartItems;
    this.total = this.cartService.cartTotal;
  }

  confirmPayment() {
    if (this.paymentType === 'NOW') {
      console.log('Paying full amount');
      // call pay-now API
    }

    if (this.paymentType === 'LATER') {
      this.router.navigate(['/bnpl_installment_calculator']);
    }
  }
}
