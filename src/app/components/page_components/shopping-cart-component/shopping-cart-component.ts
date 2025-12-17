import { Component, Signal } from '@angular/core';

import { ShoppingCartService } from '../../../services/ui_service/shoppingCartService';
import { ShoppingCartItemModel } from '../../../models/ui_models/shoppingCartItemModel';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { SystemOperationConfirmService } from '../../../services/ui_service/systemOperationConfirmService';
import { SystemMessageService } from '../../../services/ui_service/systemMessageService';

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
    private cartService: ShoppingCartService,
    private confirmService: SystemOperationConfirmService,
    private messageService: SystemMessageService
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
    this.confirmService.confirm({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item from the cart?',
      confirmText: 'Remove',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (!confirmed) return;

      this.cartService.removeItem(productId);
      this.messageService.info('Item removed from cart');
    });
  }


  cancelCart() {
    this.confirmService.confirm({
      title: 'Cancel Cart',
      message: 'This will remove all items from your cart. Continue?',
      confirmText: 'Clear Cart',
      cancelText: 'Keep Items'
    }).subscribe(confirmed => {
      if (!confirmed) return;

      this.cartService.clearCart();
      this.messageService.info('Cart cleared');
    });
  }

  placeOrder() {
    this.confirmService.confirm({
      title: 'Place Order',
      message: 'Do you want to place this order?',
      confirmText: 'Place Order',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (!confirmed) return;

      this.cartService.clearCart();
      this.messageService.success('Order placed successfully');
    });
  }
}
