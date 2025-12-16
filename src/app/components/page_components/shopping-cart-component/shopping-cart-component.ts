import { Component, Signal } from '@angular/core';

import { ShoppingCartService } from '../../../services/ui_service/shoppingCartService';
import { ShoppingCartItemModel } from '../../../models/ui_models/shoppingCartItemModel';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../custom_modules/material/material-module';

@Component({
  selector: 'app-shopping-cart-component',
  imports: [
    MaterialModule,
    CommonModule,
  ],
  templateUrl: './shopping-cart-component.html',
  styleUrl: './shopping-cart-component.scss',
})
export class ShoppingCartComponent {

  // ---------- STATE ----------
  cartItems!: Signal<ShoppingCartItemModel[]>;
  total!: Signal<number>;

  // Mat table columns
  displayedColumns = ['index', 'product', 'price', 'quantity', 'subtotal', 'action']; 

  constructor(
    private cartService: ShoppingCartService
  ) {
    this.cartItems = this.cartService.cartItems;
    this.total = this.cartService.cartTotal;
  }

  updateQty(productId: number, qty: number) {
    const result = this.cartService.updateQuantity(productId, qty);
    if (!result.success) {
      alert(result.message);
    }
  }

  remove(productId: number) {
    this.cartService.removeItem(productId);
  }

  cancelCart() {
    this.cartService.clearCart();
  }

  placeOrder() {
    alert('Order placed successfully'); // TODO: Change to notification later
    this.cartService.clearCart();
  }
}
