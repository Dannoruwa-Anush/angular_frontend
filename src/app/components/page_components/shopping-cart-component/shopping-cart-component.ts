import { Component, Signal } from '@angular/core';

import { ShoppingCartService } from '../../../services/ui_service/shoppingCartService';
import { ShoppingCartItemModel } from '../../../models/ui_models/shoppingCartItemModel';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { SystemOperationConfirmService } from '../../../services/ui_service/systemOperationConfirmService';
import { SystemMessageService } from '../../../services/ui_service/systemMessageService';
import { Router } from '@angular/router';

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

  cartItems!: Signal<ShoppingCartItemModel[]>;
  total!: Signal<number>;
  displayedColumns = ['index', 'product', 'price', 'quantity', 'subtotal', 'action'];

  constructor(
    private router: Router,
    private cartService: ShoppingCartService,
    private confirmService: SystemOperationConfirmService,
    private messageService: SystemMessageService
  ) {
    this.cartItems = this.cartService.cartItems;
    this.total = this.cartService.cartTotal;
  }

  updateQty(productId: number, qty: number) {
    const result = this.cartService.updateQuantity(productId, qty);
    if (!result.success) this.messageService.error(result.message ?? 'Invalid quantity');
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

  checkoutOrder() {
    this.confirmService.confirm({
      title: 'checkout Order',
      message: 'Do you want to checkout this order?',
      confirmText: 'checkout Order',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.router.navigate(['/submit_order']);
      //this.cartService.clearCart();
      //this.messageService.success('Order placed successfully');
    });
  }
}
