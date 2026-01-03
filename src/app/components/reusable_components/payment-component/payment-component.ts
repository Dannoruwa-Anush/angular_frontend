import { Component } from '@angular/core';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-component',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  templateUrl: './payment-component.html',
  styleUrl: './payment-component.scss',
})
export class PaymentComponent {
  paymentMethod: 'CASH' | 'CARD' = 'CASH';

  card = {
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  };

  confirmPayment() {
    if (this.paymentMethod === 'CASH') {
      console.log('Cash payment selected');
      // submit cash order
    } else {
      console.log('Card payment', this.card);
      // submit card payment
    }
  }
}
