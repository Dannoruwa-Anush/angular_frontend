import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { ShoppingCartService } from '../../../../../services/ui_service/shoppingCartService';

@Component({
  selector: 'app-order-placement-confirmation-component',
  imports: [
    MaterialModule,
    CommonModule,
  ],
  templateUrl: './order-placement-confirmation-component.html',
  styleUrl: './order-placement-confirmation-component.scss',
})
export class OrderPlacementConfirmationComponent {



  orderId = 'ORD-' + Math.floor(Math.random() * 1_000_000);
  totalAmount: number;
  paymentMethod = 'Buy Now Pay Later';

  constructor(
    private router: Router,
    private cartService: ShoppingCartService
  ) {
    this.totalAmount = 100;
  }

  goToOrders() {
    this.router.navigate(['/orders', this.orderId]);
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }
}
