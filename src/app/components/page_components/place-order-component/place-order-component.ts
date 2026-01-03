import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { ShoppingCartItemModel } from '../../../models/ui_models/shoppingCartItemModel';
import { ShoppingCartService } from '../../../services/ui_service/shoppingCartService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-place-order-component',
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './place-order-component.html',
  styleUrl: './place-order-component.scss',
})
export class PlaceOrderComponent {



  cartItems!: Signal<ShoppingCartItemModel[]>;
  total!: Signal<number>;

  paymentType: 'NOW' | 'LATER' = 'NOW';
  installmentPlan = 3;

  constructor(private cartService: ShoppingCartService) {
    this.cartItems = this.cartService.cartItems;
    this.total = this.cartService.cartTotal;
  }

  confirmPayment() {
    if (this.paymentType === 'NOW') {
      console.log('Paying full amount');
    } else {
      console.log(`Pay later in ${this.installmentPlan} months`);
    }

    // call API → navigate to success page
  }
}
